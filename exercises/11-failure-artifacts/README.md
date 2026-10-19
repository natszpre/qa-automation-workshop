# 11 · Failure artifacts: screenshot, video, trace

**Slides:** 32, 71, 97 · **Time:** ~15 min · **Level:** ⭐ core

## Goal
Configure Playwright to keep everything you need for debugging when a test fails, and learn to read the Trace Viewer.

## Task
1. In `playwright.config.ts`, in the `use` section, set:
   - `screenshot: 'only-on-failure'`,
   - `video: 'retain-on-failure'`,
   - `trace: 'retain-on-failure'`.
2. In `broken.spec.ts`, remove `.fixme` and run the test. It fails.
3. Open `npm run report` → click the test → look at the screenshot and the video → open the **Trace**.
4. In the trace, find: which action the test performed, what the DOM looked like at the moment of the assertion, and which network requests went to `/api/cart`.
5. Answer in a comment in the file: **is this an application bug or a test bug?** Fix whatever is wrong.

## Done when
- the configuration is changed,
- the test passes, and the comment contains a diagnosis based on the trace.

<details><summary>Hints</summary>

- You can also open a trace from the command line: `npx playwright show-trace test-results/<folder>/trace.zip`.
- In the trace **Network** tab, click a request and look at the response.
</details>
