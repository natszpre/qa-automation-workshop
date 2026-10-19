# 02 · Hunting brittle locators

**Slides:** 35–37 · **Time:** ~20 min · **Level:** ⭐ core

## Goal
See for yourself why CSS/XPath selectors based on classes and DOM structure are brittle, and replace them with user-facing locators.

## Task
1. Run the test: `npx playwright test 02-locators` → passes ✅.
2. Run it in chaos mode: `npm run ex:02:chaos` → fails ❌.
   On every render, the app now gets random class names and ids (like CSS Modules / CSS-in-JS).
3. Rewrite every locator in `brittle.spec.ts` following the priority from slide 37:
   1. `getByRole` / `getByLabel` / `getByText`,
   2. `getByTestId`,
   3. CSS/XPath only as a last resort.
4. Run both commands again. Both must pass.

## Done when
- the test passes in normal mode **and** in chaos mode,
- the file contains no selector with `#`, `.` or XPath.

<details><summary>Hints</summary>

- Start `npm run app`, and in a second terminal `npm run codegen`. Click elements and see which locators Playwright suggests.
- You can find the "Wireless Mouse" product like this: `page.getByTestId('product-card').filter({ hasText: 'Wireless Mouse' })`.
- `data-testid` works with `getByTestId` out of the box.
</details>
