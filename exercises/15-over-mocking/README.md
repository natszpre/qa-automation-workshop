# 15 · Mocks that lie

**Slides:** 76 (and 44 – contract testing) · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
See how a fully mocked test passes while the application is broken, and pick the right tool: a mock where it makes sense, plus a smoke test without mocks and a contract test.

## Task
1. Run `npx playwright test 15-over-mocking` ✅.
2. Run `npm run ex:15:break`. The backend renames the field `userName` to `username` (like on slide 76). The test **still passes** ✅… while a real user sees `Hello, undefined!`. Check it by hand with `CONTRACT_BREAK=1 npm run app` (macOS/Linux) or `$env:CONTRACT_BREAK="1"; npm run app` (Windows PowerShell).
3. Add to `mocking.spec.ts`:
   - **a)** a UI smoke test **without mocks** that checks the greeting with the real name,
   - **b)** an API contract test for `/api/me` with a `zod` schema that requires `userName: string`,
   - **c)** a good use of mocking: `page.route` returns `500` for `/api/products`, and the test checks the error message in the UI (a state that is hard to trigger on the real backend).
4. Run `npm run ex:15:break` again. Tests a) and b) must fail, c) must pass.

## Done when
Everything passes in normal mode, and in `CONTRACT_BREAK` mode the new tests detect the problem.

<details><summary>Hints</summary>

```ts
await page.route('**/api/products', (route) => route.fulfill({ status: 500, body: '{}' }));
```
Set up the mock **before** `page.goto(...)`.
</details>
