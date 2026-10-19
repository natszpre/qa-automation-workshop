import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { SEEDED } from '../../src/helpers/users';

test.describe('Products API', () => {
  test('GET /api/products returns all 8 products', async ({ request }) => {
    const response = await request.get('/api/products');

    expect(response.status()).toBe(200);
    const products = await response.json();
    expect(products).toHaveLength(8);
  });

  test.fixme('GET /api/products/1 returns Coffee Mug for €12.50', async ({ request }) => {
    // TODO
  });

  test.fixme('GET /api/products/999 returns 404 with error message', async ({ request }) => {
    // TODO: check the status and the "error" field
  });

  test.fixme('products response matches the contract (zod schema)', async ({ request }) => {
    // TODO: define a schema with z.object(...) and validate the response with it
  });
});

test.describe('Login API', () => {
  test.fixme('valid credentials return a token', async ({ request }) => {
    // TODO: use SEEDED.user
  });

  test.fixme('wrong password returns 401', async ({ request }) => {
    // TODO
  });

  test.fixme('missing password returns 400', async ({ request }) => {
    // TODO
  });

  test.fixme('locked account returns 423', async ({ request }) => {
    // TODO: use SEEDED.locked
  });
});

test.describe('Security', () => {
  test.fixme('cart requires authentication (no token and a fake token)', async ({ request }) => {
    // TODO: both cases must return 401
  });

  test.fixme('user cannot register as admin by sending role: "admin"', async ({ request }) => {
    // TODO: create a user with role: 'admin' in the body and check that the response has role === 'user'
  });
});

// These lines keep the linter quiet until you use the imports.
void z;
void SEEDED;
