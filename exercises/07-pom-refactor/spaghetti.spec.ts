import { test, expect } from '@playwright/test';
import { createTestUser, SEEDED } from '../../src/helpers/users';

// ❌ Everything is copy-pasted. One text change in the UI = fixes in many places.

test('login with valid user shows dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(SEEDED.user.email);
  await page.getByLabel('Password').fill(SEEDED.user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByTestId('greeting')).toHaveText('Hello, Anna Nowak!');
});

test('login with wrong password shows error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(SEEDED.user.email);
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Invalid email or password');
});

test('search filters products', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(SEEDED.user.email);
  await page.getByLabel('Password').fill(SEEDED.user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByTestId('product-card')).toHaveCount(8);
  await page.getByLabel('Search products').fill('mouse');
  await expect(page.getByTestId('product-card')).toHaveCount(1);
  await expect(page.getByTestId('product-card')).toContainText('Wireless Mouse');
});

test('add two products and place an order', async ({ page, request }) => {
  const user = await createTestUser(request);
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByTestId('product-card').filter({ hasText: 'USB-C Cable' }).getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('cart-badge')).toHaveText('Cart (1)');
  await page.getByTestId('product-card').filter({ hasText: 'Plant Pot' }).getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('cart-badge')).toHaveText('Cart (2)');
  await page.getByTestId('cart-badge').click();
  await expect(page.getByTestId('cart-total')).toHaveText('€28.49');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByTestId('order-confirmation')).toHaveText(/Order #\d+ confirmed/);
});

test('empty cart cannot be ordered', async ({ page, request }) => {
  const user = await createTestUser(request);
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByTestId('cart-badge').click();
  await expect(page.getByText('Your cart is empty.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Place order' })).toBeDisabled();
});
