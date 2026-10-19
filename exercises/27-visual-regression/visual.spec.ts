import { test, expect } from '@playwright/test';

test.fixme('login page looks as expected', async ({ page }) => {
  await page.goto('/login');
  // TODO: toHaveScreenshot
  void expect;
});

test.fixme('dashboard looks as expected', async ({ page }) => {
  // TODO: a stable Dashboard screenshot (clock, mask, fresh user, 8 products)
});
