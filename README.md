# From manual tester to automation guru – workshop exercises

Hands-on exercises for the workshop **"From manual tester to automation guru"** (Playwright + TypeScript).
You will test a small web shop that runs on your own machine. It has **built-in bugs you can switch on** (brittle CSS, flaky network, a broken API contract, slow search, accessibility issues), so you can hit real problems and fix them properly.

> **Before the workshop:** follow [BEFORE-THE-WORKSHOP.md](BEFORE-THE-WORKSHOP.md) and make sure `npm run doctor` is green.

## Quick start

```bash
npm install
npx playwright install
npm run doctor          # checks your setup
npm test                # runs all exercises (starters are skipped, so this is green)
npm run report          # opens the HTML report
```

To click around the app yourself: `npm run app` → http://localhost:3000 (log in as `user@shop.test` / `User123!`).
You do **not** need to start the app before running tests – Playwright starts its own copy on port 3100.

## How the exercises work

- Every exercise is a folder in `exercises/` with a `README.md` (goal, task, "Done when", hints) and a starter file.
- Tests you still have to write are marked `test.fixme(...)`. Remove `.fixme` when you start working on them.
- Run one exercise: `npx playwright test 02-locators` (any part of the folder name works).
- Work on a branch per exercise: `git checkout -b exercise/02`, commit, push, open a Pull Request. From exercise 18 on, CI will check your PRs.
- ⭐ = core exercise done during the workshop. ⭐⭐ = bonus / homework – great material for your portfolio.

## Exercises

| # | Exercise | Slides | Time | Level |
|---|----------|--------|------|-------|
| 00 | [Warm-up: environment, report and Git](exercises/00-setup) | 31–32, 81–85 | 10 min | ⭐ |
| 01 | [Automate or not?](exercises/01-automate-or-not) | 16–21 | 10 min | ⭐ |
| 02 | [Hunting brittle locators](exercises/02-locators) | 35–37 | 20 min | ⭐ |
| 03 | [First E2E test without `sleep()`](exercises/03-first-e2e) | 32, 71 | 20 min | ⭐ |
| 04 | [API testing with Playwright](exercises/04-api-testing) | 40–44, 46 | 20 min | ⭐ |
| 05 | [Hybrid test: data via API, checks in the UI](exercises/05-api-plus-ui) | 60, 69 | 20 min | ⭐⭐ |
| 06 | [Database validation](exercises/06-database) | 49–52 | 20 min | ⭐⭐ |
| 07 | [Refactoring to the Page Object Model](exercises/07-pom-refactor) | 55–60, 74 | 30 min | ⭐ |
| 08 | [Custom fixtures and a saved session](exercises/08-fixtures) | 60 | 25 min | ⭐⭐ |
| 09 | [Data-driven testing and the Builder pattern](exercises/09-data-driven) | 60, 63–66 | 20 min | ⭐⭐ |
| 10 | [A report that tells you what happened](exercises/10-readable-reports) | 95–98 | 20 min | ⭐ |
| 11 | [Failure artifacts: screenshot, video, trace](exercises/11-failure-artifacts) | 32, 71, 97 | 15 min | ⭐ |
| 12 | [Allure Report: dashboard and history](exercises/12-allure) | 97–98 | 20 min | ⭐⭐ |
| 13 | [Hunting a flaky test](exercises/13-flaky-hunt) | 71, 98 | 20 min | ⭐ |
| 14 | [Shared state and data leaking between tests](exercises/14-shared-state) | 73, 118 | 20 min | ⭐⭐ |
| 15 | [Mocks that lie](exercises/15-over-mocking) | 44, 76 | 20 min | ⭐⭐ |
| 16 | [Controlling time and time zones](exercises/16-clock) | 78 | 15 min | ⭐⭐ |
| 17 | [Phantom passes – green tests that check nothing](exercises/17-phantom-pass) | 74, 80 | 20 min | ⭐⭐ |
| 18 | [First pipeline in GitHub Actions](exercises/18-first-pipeline) | 86–90 | 20 min | ⭐ |
| 19 | [Secrets out of the code](exercises/19-secrets) | 92 | 15 min | ⭐⭐ |
| 20 | [Sharding and one merged report](exercises/20-sharding-merged-report) | 92, 115–121 | 25 min | ⭐ |
| 21 | [Quality gate and a report on GitHub Pages](exercises/21-quality-gate-pages) | 88, 91, 96–97 | 20 min | ⭐⭐ |
| 22 | [Tests in containers](exercises/22-docker) | 92, 104–105 | 20 min | ⭐⭐ |
| 23 | [Load testing with k6](exercises/23-k6-load) | 107–112 | 25 min | ⭐ |
| 24 | [Front-end performance budget](exercises/24-frontend-perf-budget) | 108, 112 | 20 min | ⭐⭐ |
| 25 | [How many workers is too many?](exercises/25-parallel-speed) | 115–119 | 15 min | ⭐ |
| 26 | [Automated accessibility tests (axe)](exercises/26-accessibility) | 124–125 | 15 min | ⭐⭐ |
| 27 | [Visual regression tests](exercises/27-visual-regression) | 124 | 20 min | ⭐⭐ |
| 28 | [Code review of a test written by AI](exercises/28-ai-review) | 123–131 | 20 min | ⭐ |

## Useful commands

| Command | What it does |
|---------|--------------|
| `npm test` | run all tests |
| `npx playwright test <folder>` | run one exercise |
| `npm run test:ui` | Playwright UI mode (watch, time travel) |
| `npm run test:headed` | run with a visible browser |
| `npm run report` | open the last HTML report |
| `npm run codegen` | record locators (start `npm run app` first) |
| `npm run lint` | ESLint with Playwright rules |
| `npm run app` / `app:chaos` / `app:slow` / `app:bugs` | start the app normally or with bug flags |
| `npm run ex:02:chaos`, `ex:13:flaky`, `ex:14:parallel`, `ex:15:break`, `ex:26:bugs`, `ex:27:bugs` | run an exercise with its bug flag |
| `npm run perf:load` | run the k6 load test (start `npm run app` first) |

## Repository structure

```
app/                 the shop you are testing (zero dependencies)
docs/API.md          endpoints, test accounts, bug flags
exercises/NN-*/      exercises: README + starter
src/                 your shared test code (helpers, page objects, fixtures)
perf/load.js         k6 load test (exercise 23)
scripts/             doctor + CI summary helper
playwright.config.ts
```

## Stuck?
Read the "Hints" section of the exercise, check [docs/API.md](docs/API.md), open the trace (`npm run report` → Trace), and then ask. Asking is a skill too.
