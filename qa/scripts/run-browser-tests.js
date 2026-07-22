const childProcess = require("child_process");
const path = require("path");
const { ROOT, startServer, waitForServer, stopServer } = require("./qa-lib");

function run(command, args, env = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: process.platform === "win32" && /\.cmd$/i.test(command)
  });
  if (result.error) {
    console.error(result.error.message);
    return 1;
  }
  return typeof result.status === "number" ? result.status : 1;
}

const withNodeSuite = process.argv.includes("--with-node");
let exitCode = 0;

if (withNodeSuite) {
  const nodeStatus = run(process.execPath, [path.join("qa", "scripts", "run-tests.js"), "--suite", "all"]);
  if (nodeStatus !== 0) exitCode = nodeStatus;
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const port = Number(process.env.PLAYWRIGHT_PORT || 4321);
const baseUrl = `http://127.0.0.1:${port}`;
let server;

(async () => {
  try {
    server = startServer(port);
    await waitForServer(baseUrl, 15000);
    console.log(`Running Playwright browser tests with ${npx} playwright test`);
    const playwrightStatus = run(npx, ["playwright", "test"], { PLAYWRIGHT_EXTERNAL_SERVER: "1", PLAYWRIGHT_PORT: String(port) });
    if (playwrightStatus !== 0) exitCode = playwrightStatus;
  } catch (error) {
    console.error(error.message);
    exitCode = exitCode || 1;
  } finally {
    if (server) stopServer(server.proc);
  }

  const mergeStatus = run(process.execPath, [path.join("qa", "scripts", "merge-playwright-report.js")], { PLAYWRIGHT_PORT: String(port) });
  if (mergeStatus !== 0) exitCode = mergeStatus;

  const inventoryStatus = run(process.execPath, [path.join("qa", "scripts", "inventory.js")]);
  if (inventoryStatus !== 0) exitCode = inventoryStatus;

  const prioritiesStatus = run(process.execPath, [path.join("qa", "scripts", "coverage-priorities.js")]);
  if (prioritiesStatus !== 0) exitCode = prioritiesStatus;

  process.exit(exitCode);
})();
