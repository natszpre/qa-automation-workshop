import { test, expect } from '@playwright/test';
// TODO: import AxeBuilder from '@axe-core/playwright';

test.fixme('login page has no WCAG A/AA violations', async ({ page }, testInfo) => {
  await page.goto('/login');
  // TODO
  void expect;
  void testInfo;
});

test.fixme('dashboard has no WCAG A/AA violations', async ({ page }) => {
  // TODO: log in, wait for 8 products, scan the page
});

test.fixme('cart has no WCAG A/AA violations', async ({ page }) => {
  // TODO
});
