import { test, expect } from '@playwright/test';
import { createTestUser } from '../../src/helpers/users';

// ⚠️ This test works... until someone changes the CSS.
// Run: npm run ex:02:chaos
test('user can add a product to the cart', async ({ page, request }) => {
  const user = await createTestUser(request);

  await page.goto('/login');
  await page.locator('#email').fill(user.email);
  await page.locator('#password').fill(user.password);
  await page.locator('form.login-form > button.btn.btn-primary').click();

  // third product in the list = Wireless Mouse
  const addButton = page.locator('//ul[@class="product-list"]/li[3]//button');
  await addButton.click();

  await expect(page.locator('.cart-badge')).toHaveText('Cart (1)');
});
