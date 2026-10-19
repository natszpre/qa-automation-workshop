# 26 · Automated accessibility tests (axe)

**Slides:** 124–125 · **Time:** ~15 min · **Level:** ⭐⭐ bonus

## Goal
Catch common accessibility issues (WCAG 2 A/AA) automatically on every run, before they reach users.

## Task
1. In `a11y.spec.ts`, use `AxeBuilder` from `@axe-core/playwright` to scan three pages: `/login`, `/dashboard` (after the products have loaded) and `/cart`.
2. Limit the scan to WCAG rules: `.withTags(['wcag2a', 'wcag2aa'])`.
3. Expect no violations: `expect(results.violations).toEqual([])`.
4. Attach the full scan result to the report (`testInfo.attach`).
5. Run the app version with accessibility bugs: `npm run ex:26:bugs`. The tests must fail. For each violation, write in a comment: the rule (`id`), the element, and how to fix it.

## Done when
- the scans pass against the normal app,
- in `A11Y_BUGS` mode they detect at least 4 different problems.

<details><summary>Hints</summary>

```ts
import AxeBuilder from '@axe-core/playwright';
const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
```
Automated tools find only part of the problems (often estimated at 30–50%). Manual testing with a screen reader is still needed.
</details>
