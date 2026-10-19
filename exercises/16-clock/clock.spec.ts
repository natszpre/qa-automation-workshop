import { test, expect } from '@playwright/test';
import { SEEDED } from '../../src/helpers/users';

// ❌ This test only worked on 28 Dec 2026. It fails on every other day.
test.fixme('sale banner shows days left', async ({ page }) => {
  await page.request.post('/api/login', { data: SEEDED.user });
  await page.goto('/dashboard');

  await expect(page.getByTestId('sale-banner')).toHaveText('Winter sale ends in 3 days');
  await expect(page.getByTestId('today')).toHaveText('Today is 28/12/2026');
});
