import { test, expect } from '@playwright/test';
import { SEEDED } from '../../src/helpers/users';

test.fixme('dashboard renders products within the performance budget', async ({ page }, testInfo) => {
  await page.request.post('/api/login', { data: SEEDED.user });
  await page.goto('/dashboard');
  // TODO: wait for the products, read the metrics, attach them to the report and check the budgets
  void expect;
  void testInfo;
});
