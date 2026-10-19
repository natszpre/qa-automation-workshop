# 28 · Code review of a test written by AI

**Slides:** 123–131 · **Time:** ~20 min · **Level:** ⭐ core

## Goal
Use AI as a "fast junior", but **do not trust it blindly**: find hallucinations and anti-patterns in generated code, and write a good prompt.

## Task
**Step 1 – review without AI (8 min).** `ai-generated.spec.ts` was written by an AI assistant from the prompt "write a test for placing an order in the shop". Review it with the checklist below and write every problem into `review.md` (line number + what is wrong + how to fix it).

**Step 2 – review with AI (7 min).** Paste the file into an AI assistant of your choice with the prompt below. Compare its list with yours:
- what did the AI find that you missed?
- what did the AI miss or "make up"?

**Step 3 – fix the test (5 min)** and remove `.fixme`. The test must pass.

### Checklist
- [ ] Do all elements and texts **exist** in the app? (hallucinations)
- [ ] Are locators resilient (role/label/testid) instead of CSS/XPath?
- [ ] Is there no `waitForTimeout`?
- [ ] Does every `expect` on a locator have `await`, and do the assertions actually check something?
- [ ] Is the test independent (its own data, no shared account)?
- [ ] Does the test name say what is being checked?
- [ ] Are there no secrets in the code?

### Prompt (role prompting, slide 128)
```text
Act as a Senior QA Automation Engineer reviewing a pull request.
Context: Playwright + TypeScript, the page under test is a small web shop.
Best practices we follow: user-facing locators (getByRole/getByLabel/getByTestId),
web-first assertions with await, no fixed waits, independent tests with their own data,
descriptive test names.
Task: review the test below. For each problem give: line number, problem, why it matters,
and the corrected code. Do not invent UI elements you cannot see in the code.
<paste the test here>
```

## Done when
- `review.md` lists at least 6 problems,
- the fixed test passes,
- you can give one example where the AI was wrong or missed something.

> ⚠️ Do not paste company code or data into public AI tools without permission (slide 129).
