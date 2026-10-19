// Environment check for the workshop: npm run doctor
import { execSync, spawn } from 'node:child_process';
import net from 'node:net';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const results = [];
const ok = (name, detail = '') => results.push({ icon: '✅', name, detail });
const warn = (name, detail) => results.push({ icon: '⚠️ ', name, detail });
const fail = (name, detail) => results.push({ icon: '❌', name, detail, required: true });

function version(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().split('\n')[0];
  } catch {
    return null;
  }
}

function portFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.once('listening', () => srv.close(() => resolve(true)));
    srv.listen(port, '127.0.0.1');
  });
}

// 1. Node.js
const [major, minor] = process.versions.node.split('.').map(Number);
if (major > 22 || (major === 22 && minor >= 13)) {
  major >= 24 ? ok('Node.js', `v${process.versions.node}`) : warn('Node.js', `v${process.versions.node} works, but 24 LTS is recommended`);
} else {
  fail('Node.js', `v${process.versions.node} is too old – install Node 24 LTS (minimum 22.13)`);
}

// 2. Git
const git = version('git --version');
git ? ok('Git', git) : fail('Git', 'not found – install Git and restart the terminal');

// 3. npm dependencies
try {
  const pkg = require('@playwright/test/package.json');
  ok('npm dependencies', `@playwright/test ${pkg.version}`);
} catch {
  fail('npm dependencies', 'missing – run: npm install');
}

// 4. Browser
try {
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch();
  const v = browser.version();
  await browser.close();
  ok('Chromium browser', v);
} catch (e) {
  fail('Chromium browser', 'cannot start – run: npx playwright install chromium');
}

// 5. Optional tools
const k6 = version('k6 version');
k6 ? ok('k6 (exercise 23)', k6) : warn('k6 (exercise 23)', 'not found – see BEFORE-THE-WORKSHOP.md');
const docker = version('docker --version');
docker ? ok('Docker (optional, exercise 22)', docker) : warn('Docker (optional, exercise 22)', 'not found – fine, it is optional');

// 6. Port for tests
(await portFree(3100)) ? ok('Port 3100 is free') : fail('Port 3100', 'in use – close the program that uses it');

// 7. App smoke check
await new Promise((resolve) => {
  const app = spawn(process.execPath, ['--no-warnings', 'app/server.mjs'], {
    env: { ...process.env, PORT: '3199', DB_PATH: 'app/data/doctor.db' },
    stdio: 'ignore',
  });
  const started = Date.now();
  const timer = setInterval(async () => {
    try {
      const res = await fetch('http://127.0.0.1:3199/api/health');
      if (res.ok) {
        ok('Test Shop app starts');
        clearInterval(timer);
        app.kill();
        resolve();
      }
    } catch {
      if (Date.now() - started > 10_000) {
        fail('Test Shop app', 'did not start within 10 s – check the Node.js version');
        clearInterval(timer);
        app.kill();
        resolve();
      }
    }
  }, 300);
});

// Report
console.log('\nWorkshop environment check\n');
for (const r of results) console.log(`${r.icon} ${r.name}${r.detail ? ` – ${r.detail}` : ''}`);
const failed = results.filter((r) => r.required);
console.log(
  failed.length
    ? `\n❌ ${failed.length} required check(s) failed. Fix them before the workshop.`
    : '\n🎉 All required checks passed. See you at the workshop!',
);
process.exit(failed.length ? 1 : 0);
