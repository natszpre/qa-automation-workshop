import { test, expect } from '@playwright/test';
import { DatabaseSync } from 'node:sqlite';
import { TEST_DB_PATH } from '../../src/env';
import { createTestUser } from '../../src/helpers/users';

test.skip(Boolean(process.env.BASE_URL), 'DB tests need the locally started app');

test.fixme('placing an order stores a consistent row in the database', async ({ request }) => {
  const db = new DatabaseSync(TEST_DB_PATH);
  const user = await createTestUser(request);
  // TODO: log in via API, add products, place an order
  // TODO: check orders and order_items in the database
  db.close();
});

test.fixme('deleting a user removes their orders (no orphans)', async ({ request }) => {
  // TODO
});

void expect;
