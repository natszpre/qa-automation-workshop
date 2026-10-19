# 06 · Database validation

**Slides:** 49–52 · **Time:** ~20 min · **Level:** ⭐⭐ bonus

## Goal
Check that an action in the application left a correct state in the database (**data validity**), and that deleting a user leaves no orphans (**data integrity**).

## Context
The app started by Playwright stores its data in the SQLite file `app/data/test.db`. Tables: `users`, `products`, `cart_items`, `orders`, `order_items` (schema: `app/db.mjs`). Amounts are stored in cents (`total_cents`).

Connecting to the database (built-in Node module, nothing to install):
```ts
import { DatabaseSync } from 'node:sqlite';
import { TEST_DB_PATH } from '../../src/env';

const db = new DatabaseSync(TEST_DB_PATH);
const row = db.prepare('SELECT * FROM orders WHERE user_id = ?').get(userId);
```

## Task
In `database.spec.ts`:
1. Create a user, add products to the cart via the API and place an order via the API.
2. Check in the database: `orders` has 1 row for this user, `total_cents` matches the API response, and `order_items` has as many rows as distinct products ordered.
3. Delete the user via the API and check that `orders` and `order_items` no longer contain their data (cascade delete).

## Done when
Both tests pass and each one creates its own data (no hard-coded ids).

<details><summary>Hints</summary>

- When importing `node:sqlite`, Node may print an `ExperimentalWarning`. That is expected.
- A query for orphans: `SELECT COUNT(*) AS n FROM order_items WHERE order_id = ?`.
- These tests cannot work when the app runs elsewhere (Docker, `BASE_URL`). That is why the file has `test.skip(Boolean(process.env.BASE_URL), '...')`.
</details>
