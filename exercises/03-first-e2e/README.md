# 03 · First E2E test without `sleep()`

**Slides:** 32, 71 · **Time:** ~20 min · **Level:** ⭐ core

## Goal
Write a complete checkout test that relies on Playwright's **auto-waiting** instead of fixed delays.

## Task
1. Read `sleepy.spec.ts`. The test passes, but it waits an extra 3 seconds "just in case".
2. Run `npm run lint`. You will see `no-wait-for-timeout` warnings.
3. In a new file `checkout.spec.ts`, write a test that:
   - creates a user (`createTestUser`) and logs in,
   - adds **Coffee Mug** and **Notebook A5** to the cart,
   - checks that the counter shows `Cart (2)`,
   - opens the cart and checks the total **€19.40**,
   - places the order and checks the message `Order #<number> confirmed`.
4. Delete `sleepy.spec.ts` (or fix it) so that `npm run lint` no longer reports `no-wait-for-timeout`.

## Done when
- `checkout.spec.ts` passes 5 times in a row: `npx playwright test 03-first-e2e --repeat-each=5`,
- the code has no `waitForTimeout` and no text read with `textContent()` for assertions.

<details><summary>Hints</summary>

- The product list loads with a 0.3–1.2 s delay. Actions (`click`) wait on their own until the element is visible and enabled.
- Web-first assertions (`await expect(locator).toHaveText(...)`) retry until the condition is met. `expect(await locator.textContent())` does not.
- After each click, wait for the counter to change before clicking the next product.
- The order number is not known in advance: use a regular expression, e.g. `/Order #\d+ confirmed/`.
</details>
