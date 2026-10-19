# Test Shop – API and app reference

The app lives in `app/` and has **zero dependencies** (Node's built-in `node:http` and `node:sqlite`).

| How it runs | URL | Database |
|-------------|-----|----------|
| `npm run app` (manual exploring, k6) | http://localhost:3000 | `app/data/shop.db` |
| Started automatically by Playwright during tests | http://localhost:3100 | `app/data/test.db` |

The database is **recreated on every start**, so every test run begins with the same seed data.

## Seeded accounts

| Email | Password | Role | Notes |
|-------|----------|------|-------|
| `admin@shop.test` | `Admin123!` (or `ADMIN_PASSWORD` env var) | admin | can read/delete any user |
| `user@shop.test` | `User123!` | user | name "Anna Nowak" – use only for read-only tests |
| `locked@shop.test` | `Locked123!` | user | login returns `423 Account is locked` |

For tests that change data (cart, orders), create a fresh user with `createTestUser(request)` from `src/helpers/users.ts`.

## Products

| id | Name | Price |
|----|------|-------|
| 1 | Coffee Mug | €12.50 |
| 2 | Mechanical Keyboard | €89.00 |
| 3 | Wireless Mouse | €29.99 |
| 4 | Notebook A5 | €6.90 |
| 5 | Desk Lamp | €34.00 |
| 6 | Water Bottle | €15.00 |
| 7 | USB-C Cable | €9.99 |
| 8 | Plant Pot | €18.50 |

## Authentication
`POST /api/login` returns a `token` **and** sets a `session` cookie. Protected endpoints accept either:
- header `Authorization: Bearer <token>`, or
- the `session` cookie (the browser, `page.request`, or a `request` context after logging in).

Every response has an `x-request-id` header. Error bodies look like `{ "error": "...", "requestId": "..." }`, and validation errors add `"field"`.

## Endpoints

| Method | Path | Auth | Success | Errors |
|--------|------|------|---------|--------|
| GET | `/api/health` | – | `200 { status, flags }` | |
| GET | `/api/config` | – | `200 { saleEnd }` | |
| POST | `/api/login` | – | `200 { token, user }` | `400` missing fields, `401` invalid, `423` locked |
| POST | `/api/logout` | cookie | `204` | |
| POST | `/api/users` | – | `201 { id, email, name, role }` | `400` (`field`: email / password / name), `409` duplicate |
| GET | `/api/users/:id` | yes | `200` user | `401`, `403` (not you and not admin), `404` |
| DELETE | `/api/users/:id` | yes | `204` (cascades to cart and orders) | `401`, `403`, `404` |
| GET | `/api/me` | yes | `200 { id, email, userName, role }` | `401` |
| GET | `/api/products` | – | `200 [ { id, name, price, category, stock } ]` | |
| GET | `/api/products/:id` | – | `200` product | `400` bad id, `404` |
| GET | `/api/search?q=text` | – | `200 [ products ]` | |
| GET | `/api/cart` | yes | `200 { items, count, total }` | `401` |
| POST | `/api/cart` | yes | `201` cart; body `{ productId, quantity = 1 }` | `400` quantity (1–99), `404` product |
| DELETE | `/api/cart` | yes | `204` | |
| POST | `/api/orders` | yes | `201 { id, total, status, createdAt, items }` | `400 Cart is empty` |
| GET | `/api/orders` | yes | `200 [ orders ]` (own orders) | |
| GET | `/api/orders/:id` | yes | `200` order | `404` (not found or not yours) |

Validation rules for `POST /api/users`: valid email format, password ≥ 8 characters, name 1–50 characters. A `role` field in the body is **ignored** (new users are always `user`).

## UI pages
- `/login` – labels "Email" and "Password", button "Log in", errors in `role="alert"`.
- `/dashboard` – heading "Dashboard", greeting (from `/api/me`), "Today is DD/MM/YYYY", sale banner, search ("Search products"), product cards loaded after 0.3–1.2 s, "Add to cart" buttons, random "Tip of the day".
- `/cart` – table of items, total, "Place order" button, confirmation "Order #N confirmed. Placed on DD/MM/YYYY."

Useful `data-testid` values: `login-email`, `login-password`, `login-submit`, `login-error`, `cart-badge`, `greeting`, `today`, `sale-banner`, `search`, `products-loading`, `products-error`, `product-list`, `product-card`, `product-price`, `add-to-cart`, `tip`, `cart-table`, `cart-empty`, `cart-total`, `place-order`, `order-confirmation`, `logout`.

## Bug flags
Set an environment variable to `1` before starting the app (Playwright passes them through to the app it starts):

| Flag | Effect | Exercise |
|------|--------|----------|
| `CHAOS_CLASSES` | random CSS class names and ids on every render | 02 |
| `FLAKY` | `POST /api/cart` takes a random 0–600 ms | 13 |
| `CONTRACT_BREAK` | `/api/me` returns `username` instead of `userName` | 15 |
| `SLOW_API` | `/api/search` takes 100–800 ms | 23 |
| `A11Y_BUGS` | missing labels, alt texts and `lang`, icon-only button, low contrast | 26, 27 |

The `npm run ex:*` scripts set these for you (via `cross-env`, so they work on Windows too).
Other settings: `PORT`, `DB_PATH`, `SALE_END` (default `2026-12-31`), `ADMIN_PASSWORD`.
