import { test, expect } from '@playwright/test';

// TODO (exercise 00): add your name to the test title, e.g. 'smoke (Alex): app is up and the login page is shown'
test('smoke: app is up and the login page is shown', async ({ page, request }) => {
  const health = await request.get('/api/health');
  expect(health.ok()).toBeTruthy();

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
