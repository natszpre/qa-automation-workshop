# 12 · Allure Report: dashboard and history

**Slides:** 97–98 · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Get to know the "manager" report: grouping by feature, test severity, run history and the trend of flaky tests.

## Task
1. In `playwright.config.ts`, uncomment the `allure-playwright` reporter.
2. Run the tests: `npx playwright test 10-readable 12-allure`.
3. Generate and open the report:
   ```bash
   npx playwright test 10-readable 12-allure
   npx allure generate ./allure-results
   npx allure open ./allure-report
   ```
4. In `allure.spec.ts`, add Allure metadata: `epic`, `feature`, `story`, `severity`, `owner`.
5. Create an `allurerc.mjs` file in the repository root with a report name and a `historyPath`, then run the tests and the report generation **twice**. Look at the history tab.
6. (Bonus) Make the report a **single HTML file** (`singleFile: true`) that can be emailed or downloaded from CI.

## Done when
The Allure report shows tests grouped by feature, with severity and a history of at least 2 runs.

<details><summary>Hints</summary>

```ts
import * as allure from 'allure-js-commons';
await allure.feature('Checkout');
await allure.severity('critical');
```
Documentation: https://allurereport.org/docs/playwright/ (Allure 3 – the `allure` package).
</details>
