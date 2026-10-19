import { test, expect } from '@playwright/test';
// TODO: import * as allure from 'allure-js-commons';
import { SEEDED } from '../../src/helpers/users';

test('products API lists the whole catalogue', async ({ request }) => {
  // TODO: allure.epic / feature / story / severity / owner
  const response = await request.get('/api/products');
  expect(await response.json()).toHaveLength(8);
});

test('seeded user can log in', async ({ page }) => {
  // TODO: metadata Allure
  await page.goto('/login');
  await page.getByLabel('Email').fill(SEEDED.user.email);
  await page.getByLabel('Password').fill(SEEDED.user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
