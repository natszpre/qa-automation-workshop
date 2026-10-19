import { test, expect } from '@playwright/test';
import { SEEDED } from '../../src/helpers/users';

// 👻 These tests are green. Do they actually check anything?
// Each of them passes, although the app has NO "Welcome to Narnia" heading.

test('login page has a heading', async ({ page }) => {
  await page.goto('/login');
  expect(await page.getByRole('heading', { name: 'Welcome to Narnia' }).isVisible());
});

test('wrong password shows an error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(SEEDED.user.email);
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: 'Log in' }).click();

  const error = page.getByText('Wrong password!');
  if (await error.isVisible()) {
    await expect(error).toHaveCSS('color', 'rgb(185, 28, 28)');
  }
});

test('dashboard shows the welcome banner', async ({ page }) => {
  await page.request.post('/api/login', { data: SEEDED.user });
  await page.goto('/dashboard');
  try {
    await expect(page.getByText('Welcome to Narnia')).toBeVisible({ timeout: 1000 });
  } catch {
    console.log('banner not visible, probably still loading - ignoring');
  }
});

test('products API responds', async ({ request }) => {
  await request.get('/api/products');
});

// Remove .fixme and run it. Recent Playwright versions catch a missing `await` before expect,
// but only AFTER the test has run. ESLint catches it earlier - when you save the file.
test.fixme('cart badge is visible (missing await)', async ({ page }) => {
  await page.request.post('/api/login', { data: SEEDED.user });
  await page.goto('/dashboard');
  expect(page.getByText('Cart (999)')).toBeVisible();
});
