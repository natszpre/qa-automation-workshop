import { test, expect } from '@playwright/test';
import { SEEDED } from '../../src/helpers/users';

// This test mocks the backend response. Fast and stable... but is it trustworthy?
test('dashboard greets the user (mocked backend)', async ({ page }) => {
  await page.route('**/api/me', (route) =>
    route.fulfill({ json: { id: 1, email: 'anna@shop.test', userName: 'Anna', role: 'user' } }),
  );

  await page.goto('/login');
  await page.getByLabel('Email').fill(SEEDED.user.email);
  await page.getByLabel('Password').fill(SEEDED.user.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByTestId('greeting')).toHaveText('Hello, Anna!');
});

// TODO a) smoke test without mocks
// TODO b) contract test for /api/me (zod)
// TODO c) mock a 500 for /api/products -> error message in the UI
