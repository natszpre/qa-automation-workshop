# 07 · Refactoring to the Page Object Model

**Slides:** 55–60, 74 · **Time:** ~30 min · **Level:** ⭐ core

## Goal
Turn "second-class code" (copied locators, long tests) into readable tests based on Page Objects (DRY + SRP).

## Task
1. Read `spaghetti.spec.ts`. Count how many times the login steps and the "Add to cart" locator are repeated.
2. Create in `src/pages/`:
   - `LoginPage.ts` – `goto()`, `login(email, password)`, a locator for the error message,
   - `DashboardPage.ts` – `addToCart(productName)`, `search(text)`, product list locators,
   - `CartPage.ts` – `goto()`, `total`, `placeOrder()`, `confirmation`,
   - (bonus) `components/Header.ts` – cart counter and logout, used by Dashboard and Cart.
3. Rewrite the tests in a new file `shop.spec.ts` using the Page Objects. Delete `spaghetti.spec.ts`.

## Done when
- `shop.spec.ts` has no direct `page.getBy...` or `page.locator(...)` calls – only methods and locators from Page Objects,
- changing the "Add to cart" button text would need a fix in **one** place,
- all tests pass.

<details><summary>Hints</summary>

- Keep locators as `readonly` fields set in the constructor: `this.total = page.getByTestId('cart-total')`.
- A Page Object should **not** contain business assertions (`expect(...)`) – that is the test's job. Exception: a short check that the page has loaded.
- Template:
  ```ts
  import { Page, Locator } from '@playwright/test';
  export class LoginPage {
    readonly email: Locator;
    constructor(private readonly page: Page) {
      this.email = page.getByLabel('Email');
    }
  }
  ```
</details>
