# 01 · Automate or not?

**Slides:** 16–21 · **Time:** ~10 min · **Level:** ⭐ core (discussion, no code)

## Goal
Learn to decide **what** to automate and **at which level** (unit / API / UI) before you write the first line of code.

## Task
For each scenario decide:
- **A** – automate, **M** – keep manual (or **A+M**),
- if automated, at which level: **Unit**, **API** or **UI (E2E)**,
- one sentence: why?

| # | Scenario | A / M | Level | Why? |
|---|----------|-------|-------|------|
| 1 | A user logs in with a correct password and sees the Dashboard | | | |
| 2 | Email format validation on registration (20 invalid address variants) | | | |
| 3 | "Is the new home page layout clear and pleasant?" | | | |
| 4 | The cart total adds up cents correctly (e.g. 3 × €6.90) | | | |
| 5 | The full flow: log in → cart → order | | | |
| 6 | A one-off data migration for a customer who leaves next week | | | |
| 7 | `/api/search` responds in < 300 ms with 50 users | | | |
| 8 | Exploring a new feature that has no specification yet | | | |
| 9 | A locked account cannot log in | | | |
| 10 | The site works in Chrome, Firefox and Safari | | | |

## Done when
The table is filled in and you can defend at least two answers in the discussion.

<details><summary>Hint</summary>

Go back to the testing pyramid (slide 69) and the "When to automate / When not to" slides (18–19).
</details>
