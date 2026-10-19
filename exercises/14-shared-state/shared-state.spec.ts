import { test, expect } from '@playwright/test';
import { SEEDED } from '../../src/helpers/users';

// ❌ These tests depend on each other and on the execution order.
let createdUserId: number;

test('A: registers a new customer', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { email: 'customer@shop.test', password: 'Passw0rd!', name: 'Customer' },
  });
  expect(response.status()).toBe(201);
  createdUserId = (await response.json()).id;
});

test('B: the new customer can log in', async ({ request }) => {
  const response = await request.post('/api/login', {
    data: { email: 'customer@shop.test', password: 'Passw0rd!' },
  });
  expect(response.status()).toBe(200);
  expect((await response.json()).user.id).toBe(createdUserId);
});

test('C: seeded user adds a mug to the cart', async ({ request }) => {
  const login = await request.post('/api/login', { data: SEEDED.user });
  const headers = { Authorization: `Bearer ${(await login.json()).token}` };
  const response = await request.post('/api/cart', { headers, data: { productId: 1 } });
  expect((await response.json()).count).toBe(1);
});

test('D: seeded user empties the cart', async ({ request }) => {
  const login = await request.post('/api/login', { data: SEEDED.user });
  const headers = { Authorization: `Bearer ${(await login.json()).token}` };
  await request.delete('/api/cart', { headers });
  const cart = await (await request.get('/api/cart', { headers })).json();
  expect(cart.count).toBe(0);
});
