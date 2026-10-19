import { test, expect } from '@playwright/test';
import { createTestUser } from '../../src/helpers/users';

// ❌ A password in the code = a password in the Git history forever.
const ADMIN = { email: 'admin@shop.test', password: 'Admin123!' };

test('admin can look up any user', async ({ request }) => {
  const user = await createTestUser(request);

  const login = await request.post('/api/login', { data: ADMIN });
  expect(login.status()).toBe(200);
  const token = (await login.json()).token;

  const response = await request.get(`/api/users/${user.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.status()).toBe(200);
  expect((await response.json()).email).toBe(user.email);
});
