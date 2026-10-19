# 16 · Controlling time and time zones

**Slides:** 78 · **Time:** ~15 min · **Level:** ⭐⭐ bonus

## Goal
Stop adjusting assertions to today's date. **Set the time** in the browser instead.

## Context
The Dashboard shows a "Winter sale ends in N days" banner (the sale ends on 31 Dec 2026, days are counted in UTC) and a "Today is DD/MM/YYYY" line (browser local time).

## Task
1. Remove `.fixme` from `clock.spec.ts` and run the test. It fails because it assumes a specific day.
2. Use `page.clock.setFixedTime(...)` **before** `page.goto(...)` and write 4 tests:
   - 28 Dec 2026 → `Winter sale ends in 3 days`,
   - 30 Dec 2026 → `Winter sale ends tomorrow`,
   - 31 Dec 2026 → `Winter sale ends today`,
   - 1 Jan 2027 → `The winter sale is over`.
3. Also check the text `Today is 28/12/2026`.
4. **Bonus – time zone:** set `test.use({ timezoneId: 'Pacific/Auckland' })` and the time `2026-12-30T12:30:00Z`. What does "Today is" show, and what does the banner show? Is that an application bug? Write your conclusion in a comment.

## Done when
The tests pass no matter when and in which time zone you run them (try `TZ=UTC npx playwright test 16-clock` on Linux/macOS).

<details><summary>Hints</summary>

- `await page.clock.setFixedTime(new Date('2026-12-28T10:00:00Z'));`
- Logging in via the API sets the cookie in the browser: `await page.request.post('/api/login', { data: SEEDED.user })`, then `page.goto('/dashboard')`.
</details>
