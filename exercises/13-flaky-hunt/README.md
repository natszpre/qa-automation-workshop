# 13 · Hunting a flaky test

**Slides:** 71, 98 · **Time:** ~20 min · **Level:** ⭐ core

## Goal
Find the **root cause** of flakiness instead of hiding it with `retries` or a longer `sleep`.

## Task
1. Run `npx playwright test 13-flaky-hunt`. It passes ✅. "Works on my machine."
2. Run `npm run ex:13:flaky`. The same test runs 20 times, and the app now has realistic, variable network latency. Some runs fail ❌.
3. Open the report, pick a failed run and its **trace**. Compare the response time of `POST /api/cart` with the moment of the assertion.
4. Try to "fix" it with `retries: 3` in the config. Look for the **flaky** label in the report. Why is this not a fix? Undo the change.
5. Fix the test properly. `npm run ex:13:flaky` must give 20/20.

## Done when
- 20/20 runs pass with `FLAKY=1`, without `retries` and without `waitForTimeout`,
- a one-sentence comment in the file describes the root cause.

<details><summary>Hints</summary>

- `expect(await locator.textContent()).toBe(...)` checks the text **once**, at that single moment.
- `await expect(locator).toHaveText(...)` keeps checking until it succeeds (5 s by default).
</details>
