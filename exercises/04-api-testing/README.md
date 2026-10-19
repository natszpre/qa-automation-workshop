# 04 · API testing with Playwright

**Slides:** 40–44, 46 · **Time:** ~20 min · **Level:** ⭐ core

## Goal
Test the backend without a browser: happy path, negative tests, security and the contract (response schema).

## Task
`api.spec.ts` contains one example and a list of tests marked `test.fixme`. For each one:
1. remove `.fixme`,
2. write the test,
3. run `npx playwright test 04-api-testing`.

API documentation: `docs/API.md`.

## Done when
- all tests in the list are implemented and pass,
- at least one test checks the **shape** of the response with a `zod` schema (contract).

<details><summary>Hints</summary>

- The `request` fixture already has `baseURL` set, so `request.get('/api/products')` is enough.
- Authorization header: `request.get('/api/cart', { headers: { Authorization: \`Bearer ${token}\` } })`.
- A `zod` schema:
  ```ts
  const Product = z.object({ id: z.number(), name: z.string(), price: z.number().positive() });
  z.array(Product).parse(await response.json()); // throws if the shape does not match
  ```
</details>
