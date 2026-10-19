# 08 · Custom fixtures and a saved session

**Slides:** 60 (Fixture Pattern) · **Time:** ~25 min · **Level:** ⭐⭐ bonus (requires exercise 07)

## Goal
Instead of repeating `new LoginPage(page)` and the login steps in every test, let Playwright **inject** ready-made objects into the test and clean up after them.

## Task
1. Create `src/fixtures.ts` that extends Playwright's `test` (`test.extend`) with:
   - `loginPage`, `dashboardPage`, `cartPage` – Page Object instances,
   - `testUser` – a new user created via the API and **deleted after the test** (code after `await use(...)`),
   - `loggedInPage` – a `DashboardPage` already logged in as `testUser`.
2. In `fixtures.spec.ts`, change the import to `import { test, expect } from '../../src/fixtures'` and remove `.fixme`.
3. **Bonus – storageState:** log the seeded user in once in a `setup` project and reuse the saved session in read-only tests. Compare the run time before and after.

## Done when
- tests do not create Page Objects by hand and do not log in step by step,
- test users are deleted after the run (bonus: check in a test that `GET /api/users/:id` as admin returns 404).

<details><summary>Hints</summary>

```ts
import { test as base } from '@playwright/test';
type Fixtures = { loginPage: LoginPage; testUser: TestUser };

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  testUser: async ({ request }, use) => {
    const user = await createTestUser(request);
    await use(user);
    // cleanup goes here - it runs after the test
  },
});
export { expect } from '@playwright/test';
```
storageState: https://playwright.dev/docs/auth
</details>
