import { test, expect } from '@playwright/test';
import { createTestUser, SEEDED } from '../../src/helpers/users';

// ❌ When one of these tests fails in CI, nobody will know what is broken.

test('Test 1', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(SEEDED.locked.email);
  await page.getByLabel('Password').fill(SEEDED.locked.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Account is locked');
});

test('Login scenario 2', async ({ page, request }) => {
  const user = await createTestUser(request);
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByTestId('product-card').filter({ hasText: 'Coffee Mug' }).getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('cart-badge')).toHaveText('Cart (1)');
  await page.getByTestId('cart-badge').click();
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByTestId('order-confirmation')).toContainText('confirmed');
});

test('api test', async ({ request }) => {
  const response = await request.post('/api/cart', { data: { productId: 1 } });
  expect(response.status()).toBe(401);
});
