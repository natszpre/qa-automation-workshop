# 18 · First pipeline in GitHub Actions

**Slides:** 86–90 · **Time:** ~20 min · **Level:** ⭐ core

## Goal
Run the tests automatically on every push and Pull Request, and always keep a report to download.

## Task
1. Create `.github/workflows/playwright.yml` based on slide 90, with three changes:
   - Node **24** and `cache: npm`,
   - an `npx playwright install --with-deps chromium` step before the tests,
   - an `npm run lint` step before the tests.
2. Triggers: `push` to `main`, every `pull_request` and `workflow_dispatch` (manual run).
3. The report upload must run **even when the tests fail**.
4. Commit, push to the `exercise/18` branch, open a Pull Request.
5. On GitHub: **Actions** tab → your run → download the `playwright-report` artifact, unzip it and open `index.html`.
6. Break a test on purpose, push, and look at the red status on the PR. Then fix it.

## Done when
- your PR has a green ✅ check,
- you can download and open the report from CI.

<details><summary>Hints</summary>

- `if: ${{ !cancelled() }}` on the upload step.
- If the Actions tab is disabled: Settings → Actions → General → Allow all actions.
- You can also open an unzipped report with `npx playwright show-report <folder>`.
</details>
