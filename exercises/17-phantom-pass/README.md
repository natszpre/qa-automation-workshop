# 17 · Phantom passes – green tests that check nothing

**Slides:** 74, 80 · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Catch "phantom" tests **automatically**, before they reach the repository: static analysis (ESLint) plus a pre-commit hook (Husky).

## Task
1. Run `npx playwright test 17-phantom-pass`. Everything is green ✅.
2. Read `phantom.spec.ts` and for each test write in a comment **why** it passes although it should not.
3. In `eslint.config.mjs`, change these rules from `'warn'` to `'error'`:
   `missing-playwright-await`, `valid-expect`, `no-conditional-expect`, `expect-expect`, `prefer-web-first-assertions`, `no-wait-for-timeout`.
4. Run `npm run lint`. ESLint points at every phantom (in other folders too!).
5. Install a pre-commit hook:
   ```bash
   npx husky init
   ```
   and replace the content of `.husky/pre-commit` with `npm run lint`.
6. Try to commit code with an error. The commit must be **blocked**.
7. Fix the tests in `phantom.spec.ts` so they really check the application state (use real texts from the app).

## Done when
- `npm run lint` reports no errors,
- a commit with a test missing `await` before `expect` is blocked.

<details><summary>Hints</summary>

- `expect(x)` without a matcher call checks nothing.
- `if (await el.isVisible())` checks the state **once**; if the element is not there (or the text is wrong), the assertion never runs.
- `try { await expect(...) } catch {}` swallows the assertion error.
- A test with no assertion is always green.
- Note on slide 80: recent Playwright versions report a missing `await` before `expect` when the test finishes. ESLint still catches it earlier, before the code is even run.
- The rules you tighten will also flag files from other exercises (e.g. `03-first-e2e/sleepy.spec.ts`). That is good: they show technical debt.
</details>
