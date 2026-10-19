# 14 · Shared state and data leaking between tests

**Slides:** 73, 118 · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Reach full **test isolation**: every test creates and cleans up its own data, so order and parallelism do not matter.

## Task
1. Run `npx playwright test 14-shared-state`. It passes ✅ (tests run one after another).
2. Run `npm run ex:14:parallel` (4 workers, fully parallel, 3 repetitions). It fails ❌.
3. Find every assumption in `shared-state.spec.ts` that breaks parallel runs:
   - test B depends on the user created in test A,
   - a hard-coded email (the second run gets `409`),
   - a shared seeded account whose cart is changed by different tests.
4. Rewrite the tests so each one is independent.

## Done when
`npm run ex:14:parallel` passes, and each test can be run on its own (`npx playwright test -g "name"`).

<details><summary>Hints</summary>

- Unique data: `createTestUser(request)`, or a timestamp plus a random suffix in the email.
- File-level `let` variables shared between tests are a warning sign.
</details>
