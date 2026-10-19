# 23 · Load testing with k6

**Slides:** 107–112 · **Time:** ~25 min · **Level:** ⭐ core · requires k6 to be installed

## Goal
Check how the API behaves under load, and write **acceptance criteria** (thresholds) so the test fails on its own when performance drops.

## Task
1. Terminal 1: `npm run app`. Terminal 2: `npm run perf:load`. Read the summary: `http_req_duration`, `p(90)`, `p(95)`, `http_req_failed`.
2. In `perf/load.js`, add `thresholds`:
   - less than 1% errors (`http_req_failed`),
   - `p(95) < 300 ms` for all requests,
   - more than 99% successful `check`s.
3. Replace the simple test with two **scenarios**:
   - `browse` – *load*: 20 users for ~30 s browsing `/api/products` and `/api/products/:id` with 1–3 s think time,
   - `search_spike` – *spike*: `/api/search?q=...` suddenly jumps from 5 to 100 requests per second.
   Tag the requests (`tags: { endpoint: 'search' }`) and add a separate threshold for search.
4. Stop the app and start the version with a performance regression: `npm run app:slow`. Run the test again. k6 must finish with an **error** (exit code ≠ 0) and show which threshold failed.
5. (Bonus) Generate an HTML report:
   - macOS/Linux: `K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=perf-report.html k6 run perf/load.js`
   - Windows PowerShell: `$env:K6_WEB_DASHBOARD="true"; $env:K6_WEB_DASHBOARD_EXPORT="perf-report.html"; k6 run perf/load.js`
6. (Bonus) Add a `perf` job to the CI workflow (`grafana/setup-k6-action`).

## Done when
- all thresholds are ✓ against the normal app,
- against `app:slow` the test fails on the search threshold,
- you can explain why we look at **p95** and not the average (slide 112).

<details><summary>Hints</summary>

```js
thresholds: {
  http_req_failed: ['rate<0.01'],
  'http_req_duration{endpoint:search}': ['p(95)<300'],
},
```
Scenarios: https://grafana.com/docs/k6/latest/using-k6/scenarios/
</details>
