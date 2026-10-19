# 19 · Secrets out of the code

**Slides:** 92 · **Time:** ~15 min · **Level:** ⭐⭐ bonus (requires 18)

## Goal
Remove passwords from the repository. Keep them in a `.env` file locally and in **GitHub Secrets** in CI.

## Task
1. In `admin.spec.ts` the admin password is hard-coded. Find it in the history too: `git log -p -S "Admin123!"`. A password pushed to a repository stays in its history forever.
2. Copy `.env.example` to `.env` (the file is in `.gitignore`).
3. In `playwright.config.ts`, uncomment `import 'dotenv/config';`.
4. In the test, read the data from `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`. If they are missing, throw a clear error, e.g. `Missing ADMIN_PASSWORD – copy .env.example to .env`.
5. On GitHub: Settings → Secrets and variables → Actions → add `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
6. In the workflow, pass them as environment variables (`env:`) to the test step.

## Done when
- there is no password in the code,
- the test passes locally and in CI,
- the password is masked in the CI logs (`***`).

<details><summary>Hints</summary>

```yaml
- run: npx playwright test
  env:
    ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
    ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```
The app also reads `ADMIN_PASSWORD` on start-up, so the secret can hold any password you like.
</details>
