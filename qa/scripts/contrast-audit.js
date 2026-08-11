// Measures the contrast of the theme's text-on-background pairs against WCAG 2.1.
// Colour choices are otherwise a matter of taste; this part is measurable, so it
// is worth checking rather than guessing.
//
//   npm run audit:contrast
const AA_NORMAL = 4.5;   // body text
const AA_LARGE = 3.0;    // >=18.66px bold or >=24px
const AA_UI = 3.0;       // borders, icons, focus rings

// Tokens are read from theme.css rather than duplicated here: an audit that keeps
// its own copy of the values will happily pass while the real stylesheet drifts.
const fs = require("fs");
const path = require("path");

function readTokens() {
  const css = fs.readFileSync(path.join(__dirname, "..", "..", "public", "theme.css"), "utf8");
  const blockFor = (selector) => {
    const at = css.indexOf(selector);
    if (at === -1) throw new Error(`Could not find ${selector} in theme.css`);
    return css.slice(at, css.indexOf("}", at));
  };
  const parse = (block) => {
    const out = {};
    for (const match of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
      out[match[1]] = match[2];
    }
    return out;
  };
  return {
    light: parse(blockFor(":root {")),
    dark: parse(blockFor(':root[data-theme="dark"] {'))
  };
}

const THEMES = readTokens();

// Pairs the interface actually renders.
const PAIRS = [
  ["text-primary", "surface", AA_NORMAL, "body text on cards"],
  ["text-primary", "bg-primary", AA_NORMAL, "body text on page"],
  ["text-secondary", "surface", AA_NORMAL, "secondary text on cards"],
  ["text-secondary", "bg-primary", AA_NORMAL, "secondary text on page"],
  ["text-muted", "surface", AA_NORMAL, "muted text on cards"],
  ["text-muted", "bg-primary", AA_NORMAL, "muted text on page"],
  ["text-muted", "surface-hover", AA_NORMAL, "muted text on hover rows"],
  ["primary", "surface", AA_NORMAL, "links and primary text"],
  ["success", "surface", AA_NORMAL, "success text"],
  ["warning", "surface", AA_NORMAL, "warning text"],
  ["danger", "surface", AA_NORMAL, "danger text"],
  ["focus", "surface", AA_UI, "focus ring on cards"],
  ["focus", "bg-primary", AA_UI, "focus ring on page"],
  // WCAG 1.4.11 covers boundaries that identify a control. A card hairline is
  // decoration and is deliberately left light.
  ["field-border", "surface", AA_UI, "form control borders"],
  ["field-border", "bg-primary", AA_UI, "form control borders on page"]
];

function toRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

let failures = 0;
for (const [themeName, tokens] of Object.entries(THEMES)) {
  console.log(`\n${themeName.toUpperCase()}\n`);
  for (const [fg, bg, threshold, label] of PAIRS) {
    const ratio = contrast(tokens[fg], tokens[bg]);
    const pass = ratio >= threshold;
    if (!pass) failures += 1;
    console.log(
      `  ${pass ? "PASS" : "FAIL"}  ${ratio.toFixed(2).padStart(5)}:1  (needs ${threshold})  ${label}`
      + `\n        ${fg} ${tokens[fg]} on ${bg} ${tokens[bg]}`
    );
  }
}
console.log(`\n${failures ? `${failures} pair(s) below WCAG AA` : "All measured pairs meet WCAG AA"}\n`);
process.exitCode = failures ? 1 : 0;
