// Simple SQLite database using the built-in node:sqlite module (Node >= 22.13).
// The database is recreated every time the app starts.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const PRODUCTS = [
  ['Coffee Mug', 1250, 'kitchen', 40],
  ['Mechanical Keyboard', 8900, 'electronics', 12],
  ['Wireless Mouse', 2999, 'electronics', 25],
  ['Notebook A5', 690, 'office', 100],
  ['Desk Lamp', 3400, 'office', 15],
  ['Water Bottle', 1500, 'kitchen', 60],
  ['USB-C Cable', 999, 'electronics', 80],
  ['Plant Pot', 1850, 'home', 30],
];

export function openDb(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(file + suffix, { force: true });
  }

  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      name       TEXT NOT NULL,
      role       TEXT NOT NULL DEFAULT 'user',
      locked     INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      category    TEXT NOT NULL,
      stock       INTEGER NOT NULL
    );

    CREATE TABLE cart_items (
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity   INTEGER NOT NULL,
      PRIMARY KEY (user_id, product_id)
    );

    CREATE TABLE orders (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      total_cents INTEGER NOT NULL,
      status      TEXT NOT NULL DEFAULT 'placed',
      created_at  TEXT NOT NULL
    );

    CREATE TABLE order_items (
      order_id         INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id       INTEGER NOT NULL REFERENCES products(id),
      quantity         INTEGER NOT NULL,
      unit_price_cents INTEGER NOT NULL
    );
  `);

  const insertUser = db.prepare(
    'INSERT INTO users (email, password, name, role, locked) VALUES (?, ?, ?, ?, ?)',
  );
  insertUser.run('admin@shop.test', process.env.ADMIN_PASSWORD ?? 'Admin123!', 'Ada Admin', 'admin', 0);
  insertUser.run('user@shop.test', 'User123!', 'Anna Nowak', 'user', 0);
  insertUser.run('locked@shop.test', 'Locked123!', 'Leon Locked', 'user', 1);

  const insertProduct = db.prepare(
    'INSERT INTO products (name, price_cents, category, stock) VALUES (?, ?, ?, ?)',
  );
  for (const p of PRODUCTS) insertProduct.run(...p);

  return db;
}
