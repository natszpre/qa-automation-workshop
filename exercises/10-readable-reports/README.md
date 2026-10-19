# 10 · A report that tells you what happened

**Slides:** 95–98 · **Time:** ~20 min · **Level:** ⭐ core

## Goal
Make sure that anyone who sees a red test in CI knows **within seconds** what is broken, without reading the code.

## Task
Improve `bad-names.spec.ts`:
1. **Names like error messages:** instead of `Test 1`, write e.g. `locked user cannot log in and sees "Account is locked"`.
2. **Steps:** split longer tests with `test.step('Add Coffee Mug to cart', ...)`.
3. **Tags:** tag tests with `@smoke` or `@regression` and run only the smoke tests: `npx playwright test 10-readable --grep @smoke`.
4. **Context on failure:** in the API test, attach the request body, the response and the `x-request-id` header to the report with `testInfo.attach(...)`.
5. **Annotation:** add an annotation with a link to a (made-up) ticket to one test, e.g. `{ type: 'issue', description: 'https://jira.example.com/SHOP-123' }`.
6. Open `npm run report` and compare "before" and "after".

## Done when
- every test name describes the behaviour and the expected result,
- the report shows steps, tags, the annotation and the JSON attachment.

<details><summary>Hints</summary>

```ts
test('...', { tag: '@smoke', annotation: { type: 'issue', description: '...' } }, async ({ page }, testInfo) => {
  await testInfo.attach('response', { body: JSON.stringify(body, null, 2), contentType: 'application/json' });
});
```
</details>
