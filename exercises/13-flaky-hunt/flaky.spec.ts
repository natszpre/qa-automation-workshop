import { test, expect } from '@playwright/test';
import { createTestUser } from '../../src/helpers/users';

test('adding a product increases the cart counter', async ({ page, request }) => {
  const user = await createTestUser(request);
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page
    .getByTestId('product-card')
    .filter({ hasText: 'Desk Lamp' })
    .getByRole('button', { name: 'Add to cart' })
    .click();

  // "The server is fast, half a second is enough"
  await page.waitForTimeout(500);
  const badge = await page.getByTestId('cart-badge').textContent();
  expect(badge).toBe('Cart (1)');
});
