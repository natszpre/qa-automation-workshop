# 20 · Sharding and one merged report

**Slides:** 92, 115–121 · **Time:** ~25 min · **Level:** ⭐ core (if time allows) · requires 18

## Goal
Split the tests across 3 parallel machines in CI and get **one** HTML report from all parts at the end.

## Task
1. See locally how the split works: `npx playwright test --shard=1/3 --list`, then `--shard=2/3 --list`.
2. In the workflow, add a `strategy.matrix` with `shardIndex: [1, 2, 3]` and `shardTotal: [3]` (slide 121) and `fail-fast: false`.
3. Each shard runs the tests with `--reporter=blob` and uploads the `blob-report/` folder as an artifact named `blob-report-<number>`.
4. Add a second job, `merge-reports` (`needs: [test]`, `if: ${{ !cancelled() }}`), that:
   - downloads all `blob-report-*` artifacts into one folder (`merge-multiple: true`),
   - runs `npx playwright merge-reports --reporter html ./all-blob-reports`,
   - uploads one `playwright-report` artifact.
5. (Bonus) Run `merge-reports` with the `html,json` reporters and add a summary to the Summary tab: `node scripts/ci-summary.mjs results.json >> "$GITHUB_STEP_SUMMARY"`.
6. (Bonus) Add a `firefox` project in `playwright.config.ts` and install that browser in CI.

## Done when
The Actions tab shows 3 parallel test jobs and one artifact with a report that contains **all** tests.

<details><summary>Hints</summary>

- Documentation: https://playwright.dev/docs/test-sharding
- Environment variable for the JSON reporter: `PLAYWRIGHT_JSON_OUTPUT_NAME: results.json`.
</details>
