# 05 · Hybrid test: data via API, checks in the UI

**Slides:** 60 (Facade), 69 (Testing Pyramid) · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Prepare the application state quickly via the API, and use the browser only for what really has to be checked in the UI. Clean up afterwards.

## Task
In `hybrid.spec.ts`:
1. **Setup via API:** create a user, log in with `POST /api/login`, add 2 × **Desk Lamp** to the cart (`POST /api/cart`).
2. **UI:** log in in the browser, open `/cart`, check the "Desk Lamp" row, quantity 2 and the total **€68.00**. Place the order.
3. **Verification via API:** `GET /api/orders` returns exactly one order with total 68.
4. **Cleanup:** in `test.afterEach`, delete the user (`DELETE /api/users/:id`).

Bonus: measure the test duration and compare it with a version that adds the products by clicking in the UI.

## Done when
The test passes, and afterwards the user no longer exists (`GET /api/users/:id` as admin → 404).

<details><summary>Hints</summary>

- You can skip the UI login too: after `POST /api/login` through `page.request`, the browser gets the session cookie, because `page.request` shares cookies with the page context.
- A table row: `page.getByRole('row', { name: /Desk Lamp/ })`.
</details>
