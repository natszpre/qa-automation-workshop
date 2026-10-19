# 22 · Tests in containers

**Slides:** 92 (Ephemeral Envs), 104–105 · **Time:** ~20 min · **Level:** ⭐⭐ bonus · requires Docker

## Goal
Run the app and the tests in containers: the same environment for everyone and in CI. This also helps with screenshots in exercise 27.

## Task
1. Create a `docker-compose.yml` in the repository root with two services:
   - **app** – the `node:24-alpine` image, runs `node --no-warnings app/server.mjs` on port 3000, with a `healthcheck` on `/api/health`,
   - **tests** – the `mcr.microsoft.com/playwright:v<version>-noble` image (version **identical** to `@playwright/test` in `package-lock.json`), which waits until `app` is healthy and runs `npm ci && npx playwright test`.
2. In `tests`, set `BASE_URL=http://app:3000`. The Playwright config will then not start its own app.
3. Run: `docker compose up --build --abort-on-container-exit --exit-code-from tests`.
4. Notice that the database tests (exercise 06) are skipped. Why?

## Done when
The tests pass in a container, and the HTML report is on your disk in `playwright-report/`.

<details><summary>Hints</summary>

- Check the version with `npx playwright --version`.
- Mount the repository as a volume (`.:/work`) and `node_modules` as a separate anonymous volume (`/work/node_modules`) so libraries from your OS do not get mixed in.
- `ipc: host` is recommended for Chromium in a container.
</details>
