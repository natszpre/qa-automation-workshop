# 21 · Quality gate and a report on GitHub Pages

**Slides:** 88, 91, 96–97 · **Time:** ~20 min · **Level:** ⭐⭐ bonus (requires 18 or 20)

## Goal
The test report is a **gate**: a red pipeline blocks the merge. The latest report from `main` is always available at a fixed URL.

## Task
1. **Gate:** Settings → Rules → Rulesets (or Branches → Branch protection) for `main`:
   - require a Pull Request,
   - require the status check from your workflow to pass.
2. Open a PR with a test broken on purpose. The **Merge** button must be blocked.
3. **GitHub Pages:** Settings → Pages → Source: **GitHub Actions**.
4. Add a job to the workflow that publishes the merged HTML report **only on `main`**:
   `actions/upload-pages-artifact` + `actions/deploy-pages` (permissions `pages: write`, `id-token: write`).
5. Put a link to the report and a workflow status badge at the top of `README.md`.

## Done when
- a PR with a red test cannot be merged,
- the report from the latest run on `main` is available at `https://<login>.github.io/<repo>/`.

<details><summary>Hints</summary>

- With a shard matrix, check names are long (`test (1, 3)`). Add a small `quality-gate` job with `needs: [...]` and `if: always()` that checks the results, and require only that job.
- On the free plan, Pages requires a **public** repository.
- Badge: `![CI](https://github.com/<login>/<repo>/actions/workflows/playwright.yml/badge.svg)`
- The complete reference pipeline: ask the instructor for `full-pipeline.yml`.
</details>
