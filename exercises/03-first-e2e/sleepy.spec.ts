import { test, expect } from '@playwright/test';
import { createTestUser } from '../../src/helpers/users';

// ❌ Anti-pattern: fixed waits. Slow (always +3 s) and still not safe.
test('add first product to cart', async ({ page, request }) => {
  const user = await createTestUser(request);
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForTimeout(2000); // "the list is loading"
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.waitForTimeout(1000); // "the cart is updating"

  const badge = await page.getByTestId('cart-badge').textContent();
  expect(badge).toBe('Cart (1)');
});
