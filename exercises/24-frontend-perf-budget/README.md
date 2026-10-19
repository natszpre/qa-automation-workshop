# 24 · Front-end performance budget in Playwright

**Slides:** 108, 112 · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Measure **how quickly the user sees content** and guard it on every test run. This complements k6: k6 measures the server under load, Playwright measures one user's experience in the browser.

## Task
In `perf-budget.spec.ts`:
1. Log in, open the Dashboard and wait for 8 products.
2. With `page.evaluate`, read from the **Navigation Timing API**: TTFB and `domContentLoaded`.
3. The app sets the mark `performance.mark('products-rendered')` when the product list appears. Read its `startTime`. This is a user-centric metric.
4. Set budgets: `productsRendered < 2000 ms` (hard), `domContentLoaded < 1000 ms` (`expect.soft`).
5. Attach the measured values to the report as JSON (`testInfo.attach`).
6. (Bonus, Chromium only) Measure **LCP** with a `PerformanceObserver` (`type: 'largest-contentful-paint', buffered: true`).

## Done when
The test passes, and the report contains an attachment with the metrics.

<details><summary>Hints</summary>

```ts
const metrics = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const mark = performance.getEntriesByName('products-rendered')[0];
  return { ttfb: nav.responseStart - nav.requestStart, productsRendered: mark?.startTime };
});
```
Remember: one measurement is not statistics. Set budgets with some headroom and watch the trend in the reports.
</details>
