import { test, expect } from '@playwright/test';
import { createTestUser, TestUser } from '../../src/helpers/users';

let user: TestUser;
let token: string;

test.fixme('order prepared via API is shown and placed in the UI', async ({ page, request }) => {
  // 1. Setup via API
  user = await createTestUser(request);
  // TODO: POST /api/login -> token
  // TODO: POST /api/cart { productId: 5, quantity: 2 } (Desk Lamp)

  // 2. UI
  // TODO

  // 3. Verification via API
  // TODO
});

test.afterEach(async ({ request }) => {
  // 4. Cleanup
  // TODO: DELETE /api/users/:id
});

void expect;
void token;
