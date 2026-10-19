// Turns the Playwright JSON reporter output into a short Markdown summary (GitHub Job Summary).
// Usage: node scripts/ci-summary.mjs results.json >> "$GITHUB_STEP_SUMMARY"
import fs from 'node:fs';

const file = process.argv[2] ?? 'results.json';
const { stats } = JSON.parse(fs.readFileSync(file, 'utf8'));
const total = stats.expected + stats.unexpected + stats.flaky + stats.skipped;
const status = stats.unexpected > 0 ? '❌ FAILED' : stats.flaky > 0 ? '⚠️ PASSED WITH FLAKY TESTS' : '✅ PASSED';

console.log(`## Playwright: ${status}

| Passed | Failed | Flaky | Skipped | Total | Duration |
|-------:|-------:|------:|--------:|------:|---------:|
| ${stats.expected} | ${stats.unexpected} | ${stats.flaky} | ${stats.skipped} | ${total} | ${(stats.duration / 1000).toFixed(1)} s |
`);
