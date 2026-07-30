"use strict";
/* Minimal XLSX reader/writer.
 *
 * The project ships with no third-party packages, so rather than pull in a
 * spreadsheet library this implements just the slice of the format the app
 * needs: read a workbook's sheets as arrays of strings, and write one back.
 *
 * An .xlsx is a ZIP of XML parts. Only stored (0) and deflated (8) entries
 * appear in practice, and Node's zlib handles the second, so no compression
 * code is needed here.
 */

const zlib = require("zlib");

/* ------------------------------------------------------------------ ZIP in */

function findEndOfCentralDirectory(buffer) {
  // The EOCD record is at the end, after a variable-length comment.
  const minimum = 22;
  const from = Math.max(0, buffer.length - 65535 - minimum);
  for (let at = buffer.length - minimum; at >= from; at--) {
    if (buffer.readUInt32LE(at) === 0x06054b50) return at;
  }
  throw new Error("Not a valid .xlsx file (no ZIP end record)");
}

function readZipEntries(buffer) {
  const eocd = findEndOfCentralDirectory(buffer);
  const count = buffer.readUInt16LE(eocd + 10);
  let at = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let index = 0; index < count; index++) {
    if (buffer.readUInt32LE(at) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(at + 10);
    const compressedSize = buffer.readUInt32LE(at + 20);
    const nameLength = buffer.readUInt16LE(at + 28);
    const extraLength = buffer.readUInt16LE(at + 30);
    const commentLength = buffer.readUInt16LE(at + 32);
    const localHeaderAt = buffer.readUInt32LE(at + 42);
    const name = buffer.toString("utf8", at + 46, at + 46 + nameLength);

    // The local header repeats the name/extra with its own lengths.
    const localNameLength = buffer.readUInt16LE(localHeaderAt + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderAt + 28);
    const dataAt = localHeaderAt + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(dataAt, dataAt + compressedSize);

    entries.set(name, method === 0 ? raw : zlib.inflateRawSync(raw));
    at += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

/* ----------------------------------------------------------------- ZIP out */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = -1;
  for (let i = 0; i < buffer.length; i++) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function writeZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const [name, contents] of files) {
    const nameBuffer = Buffer.from(name, "utf8");
    const body = Buffer.isBuffer(contents) ? contents : Buffer.from(contents, "utf8");
    const deflated = zlib.deflateRawSync(body, { level: 9 });
    const sum = crc32(body);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);            // version needed
    local.writeUInt16LE(0, 6);             // flags
    local.writeUInt16LE(8, 8);             // deflate
    local.writeUInt32LE(sum, 14);
    local.writeUInt32LE(deflated.length, 18);
    local.writeUInt32LE(body.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    chunks.push(local, nameBuffer, deflated);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4);
    entry.writeUInt16LE(20, 6);
    entry.writeUInt16LE(8, 10);
    entry.writeUInt32LE(sum, 16);
    entry.writeUInt32LE(deflated.length, 20);
    entry.writeUInt32LE(body.length, 24);
    entry.writeUInt16LE(nameBuffer.length, 28);
    entry.writeUInt32LE(offset, 42);
    central.push(entry, nameBuffer);

    offset += local.length + nameBuffer.length + deflated.length;
  }

  const centralBuffer = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuffer.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, centralBuffer, end]);
}

/* --------------------------------------------------------------- XML utils */

function decodeEntities(text) {
  return String(text)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    // XML 1.0 forbids most control characters outright.
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

function columnToIndex(ref) {
  const letters = String(ref).replace(/[^A-Z]/gi, "").toUpperCase();
  let index = 0;
  for (const char of letters) index = index * 26 + (char.charCodeAt(0) - 64);
  return index - 1;
}

function indexToColumn(index) {
  let n = index + 1;
  let out = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

/* -------------------------------------------------------------------- read */

function parseSharedStrings(xml) {
  if (!xml) return [];
  const strings = [];
  // Each <si> may hold one <t> or several inside <r> runs; concatenate them.
  const items = xml.match(/<si>[\s\S]*?<\/si>/g) || [];
  for (const item of items) {
    const parts = item.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
    strings.push(parts.map((p) => decodeEntities(p.replace(/<t[^>]*>|<\/t>/g, ""))).join(""));
  }
  return strings;
}

function parseSheet(xml, sharedStrings) {
  const rows = [];
  // Self-closing forms must be matched first. Otherwise `<c r="H7"/>` is
  // consumed by the open-tag alternative, which then scans forward to the next
  // `</c>` and swallows the following cell — shifting every later value one
  // column left whenever an empty cell is omitted.
  const rowMatches = xml.match(/<row\b[^>]*\/>|<row\b[^>]*>[\s\S]*?<\/row>/g) || [];
  for (const rowXml of rowMatches) {
    const rowNumber = Number((rowXml.match(/\br="(\d+)"/) || [])[1] || rows.length + 1);
    const cells = [];
    const cellMatches = rowXml.match(/<c\b[^>]*\/>|<c\b[^>]*>[\s\S]*?<\/c>/g) || [];
    for (const cellXml of cellMatches) {
      const ref = (cellXml.match(/\br="([A-Z]+\d+)"/) || [])[1];
      const type = (cellXml.match(/\bt="([^"]+)"/) || [])[1] || "n";
      let value = "";
      if (type === "inlineStr") {
        const parts = cellXml.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
        value = parts.map((p) => decodeEntities(p.replace(/<t[^>]*>|<\/t>/g, ""))).join("");
      } else {
        const raw = (cellXml.match(/<v[^>]*>([\s\S]*?)<\/v>/) || [])[1];
        if (raw !== undefined) {
          value = type === "s" ? (sharedStrings[Number(raw)] ?? "") : decodeEntities(raw);
        }
      }
      const index = ref ? columnToIndex(ref) : cells.length;
      cells[index] = value;
    }
    for (let i = 0; i < cells.length; i++) if (cells[i] === undefined) cells[i] = "";
    rows[rowNumber - 1] = cells;
  }
  for (let i = 0; i < rows.length; i++) if (!rows[i]) rows[i] = [];
  return rows;
}

/** Reads a workbook buffer into { sheetNames, sheets: { name: string[][] } }. */
function readWorkbook(buffer) {
  const entries = readZipEntries(buffer);
  const text = (name) => (entries.has(name) ? entries.get(name).toString("utf8") : "");

  const workbookXml = text("xl/workbook.xml");
  const relsXml = text("xl/_rels/workbook.xml.rels");
  const shared = parseSharedStrings(text("xl/sharedStrings.xml"));

  const relTargets = new Map();
  for (const rel of relsXml.match(/<Relationship\b[^>]*\/>/g) || []) {
    const id = (rel.match(/Id="([^"]+)"/) || [])[1];
    let target = (rel.match(/Target="([^"]+)"/) || [])[1] || "";
    if (target.startsWith("/")) target = target.slice(1);
    else if (!target.startsWith("xl/")) target = "xl/" + target;
    if (id) relTargets.set(id, target);
  }

  const sheetNames = [];
  const sheets = {};
  for (const sheet of workbookXml.match(/<sheet\b[^>]*\/>/g) || []) {
    const name = decodeEntities((sheet.match(/name="([^"]*)"/) || [])[1] || "");
    const relId = (sheet.match(/r:id="([^"]+)"/) || [])[1];
    const path = relTargets.get(relId);
    sheetNames.push(name);
    sheets[name] = path && entries.has(path) ? parseSheet(entries.get(path).toString("utf8"), shared) : [];
  }
  return { sheetNames, sheets };
}

/* ------------------------------------------------------------------- write */

function sheetXml(rows) {
  const body = rows.map((cells, rowIndex) => {
    const cellXml = (cells || []).map((value, colIndex) => {
      if (value === null || value === undefined || value === "") return "";
      const ref = `${indexToColumn(colIndex)}${rowIndex + 1}`;
      // Everything is written as an inline string: the data here is text, and
      // it avoids a shared-string table plus any locale-dependent number
      // formatting on the way back in.
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
    }).join("");
    return `<row r="${rowIndex + 1}">${cellXml}</row>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

/** Writes { name: string[][] } sheets into an .xlsx buffer. */
function writeWorkbook(sheets) {
  const names = Object.keys(sheets);
  const files = [];

  files.push(["[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${names.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`]);

  files.push(["_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`]);

  files.push(["xl/workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${names.map((name, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>`]);

  files.push(["xl/_rels/workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${names.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}</Relationships>`]);

  names.forEach((name, i) => files.push([`xl/worksheets/sheet${i + 1}.xml`, sheetXml(sheets[name] || [])]));
  return writeZip(files);
}

module.exports = { readWorkbook, writeWorkbook };
