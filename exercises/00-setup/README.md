# 00 · Warm-up: environment, report and Git

**Slides:** 31–32 (Playwright), 81–85 (Git) · **Time:** ~10 min · **Level:** ⭐ core

## Goal
Check that everything works and get to know the tools you will use all day: the HTML report, UI mode and the Trace Viewer.

## Task
1. Run `npm run doctor`. All required checks should show ✅.
2. Run the test: `npx playwright test 00-setup`.
3. Open the report: `npm run report`. Click the test and look at its steps.
4. Start UI mode: `npm run test:ui`. Run the test from the UI and click through the timeline (time travel).
5. Create a branch: `git checkout -b exercise/00`.
6. In `smoke.spec.ts`, add your name to the test title and run the test again.
7. Commit and push: `git commit -am "00: my name in the smoke test"` and `git push -u origin exercise/00`.

## Done when
- the test passes locally,
- you can see your `exercise/00` branch on GitHub.

<details><summary>Hints</summary>

- To click around the app manually, start it with `npm run app` (http://localhost:3000). Tests start **their own** copy of the app on port 3100, so you do not need to start it before running tests.
- Test account: `user@shop.test` / `User123!`. The full list is in `docs/API.md`.
</details>
