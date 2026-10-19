import { test, expect } from '@playwright/test';
import { SEEDED } from '../../src/helpers/users';

// These tests only read data (they change nothing), so they are safe to run in parallel.
const catalogue = [
  { name: 'Coffee Mug', price: '€12.50' },
  { name: 'Mechanical Keyboard', price: '€89.00' },
  { name: 'Wireless Mouse', price: '€29.99' },
  { name: 'Notebook A5', price: '€6.90' },
  { name: 'Desk Lamp', price: '€34.00' },
  { name: 'Water Bottle', price: '€15.00' },
  { name: 'USB-C Cable', price: '€9.99' },
  { name: 'Plant Pot', price: '€18.50' },
];

for (const product of catalogue) {
  test(`search finds ${product.name} priced ${product.price}`, async ({ page }) => {
    await page.request.post('/api/login', { data: SEEDED.user });
    await page.goto('/dashboard');
    await expect(page.getByTestId('product-card')).toHaveCount(8);

    await page.getByLabel('Search products').fill(product.name);

    const card = page.getByTestId('product-card');
    await expect(card).toHaveCount(1);
    await expect(card.getByRole('heading')).toHaveText(product.name);
    await expect(card.getByTestId('product-price')).toHaveText(product.price);
  });
}
