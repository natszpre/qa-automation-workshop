import { test, expect } from '@playwright/test';
import { createTestUser } from '../../src/helpers/users';

test.fixme('cart total for two Water Bottles', async ({ page, request }) => {
  const user = await createTestUser(request);
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  const bottle = page.getByTestId('product-card').filter({ hasText: 'Water Bottle' });
  await bottle.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('cart-badge')).toHaveText('Cart (1)');
  await bottle.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('cart-badge')).toHaveText('Cart (2)');

  await page.getByTestId('cart-badge').click();
  await expect(page.getByTestId('cart-total')).toHaveText('€15.00');

  // DIAGNOSIS (fill in):
});
