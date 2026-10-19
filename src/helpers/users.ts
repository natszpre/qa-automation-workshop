import { APIRequestContext, expect } from '@playwright/test';

export type TestUser = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
};

/** Accounts created when the app starts. Use them only in tests that change NOTHING (e.g. login). */
export const SEEDED = {
  user: { email: 'user@shop.test', password: 'User123!', name: 'Anna Nowak' },
  admin: { email: 'admin@shop.test', password: process.env.ADMIN_PASSWORD ?? 'Admin123!', name: 'Ada Admin' },
  locked: { email: 'locked@shop.test', password: 'Locked123!', name: 'Leon Locked' },
} as const;

/**
 * Creates a new, unique user via the API.
 * Every test that changes data (cart, orders) should have its own user.
 * You will see how this works in exercises 05 and 14.
 */
export async function createTestUser(
  request: APIRequestContext,
  overrides: Partial<Pick<TestUser, 'email' | 'password' | 'name'>> = {},
): Promise<TestUser> {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const data = {
    email: `user-${unique}@shop.test`,
    password: 'Passw0rd!',
    name: 'Test User',
    ...overrides,
  };
  const response = await request.post('/api/users', { data });
  expect(response.status(), await response.text()).toBe(201);
  const body = await response.json();
  return { ...body, password: data.password };
}
