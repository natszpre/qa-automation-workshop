# 27 · Visual regression tests

**Slides:** 124 · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Detect unintended visual changes, and deal with dynamic content that breaks screenshot comparisons.

## Task
1. In `visual.spec.ts`, add `await expect(page).toHaveScreenshot('login.png')` for the login page.
2. Run the test **twice**. The first run creates the baseline and fails. The second run compares and passes.
3. Add a screenshot of the **Dashboard**. This page has content that changes on every visit: today's date, the days left in the sale, a random tip of the day, and, with a shared account, the cart counter. Make the screenshot stable:
   - freeze the clock (`page.clock.setFixedTime`) – see exercise 16,
   - mask the random tip (`mask: [...]`),
   - use a fresh user (`createTestUser`) instead of a shared account,
   - wait for all 8 products before taking the screenshot.
4. Run `npm run ex:27:bugs` and look at the *Expected / Actual / Diff* comparison in the report.
5. Write in a comment why baselines made on Windows/macOS will not work in CI on Linux, and how to solve that (exercise 22).

## Done when
Both screenshots pass 5 times in a row (`--repeat-each=5`), and the bug mode shows a difference.

<details><summary>Hints</summary>

- Update baselines after an intended change: `npx playwright test 27-visual --update-snapshots`.
- Baselines are saved in the `visual.spec.ts-snapshots/` folder and **should** be committed.
</details>
