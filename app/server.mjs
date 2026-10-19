// Test Shop - the practice app (System Under Test).
// Zero dependencies: node:http + node:sqlite. Requires Node >= 22.13 (24 LTS recommended).
//
// Start:  npm run app          -> http://localhost:3000
// Bug modes (environment variables, value 1):
//   CHAOS_CLASSES   random CSS class names and ids (exercise 02)
//   FLAKY           random 0-600 ms delay on POST /api/cart (exercise 13)
//   CONTRACT_BREAK  /api/me returns "username" instead of "userName" (exercise 15)
//   SLOW_API        /api/search responds in 100-800 ms (exercise 23)
//   A11Y_BUGS       accessibility bugs in the UI (exercises 26 and 27)
import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db.mjs';
import * as views from './views.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3000);
const DB_PATH = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(here, 'data', 'shop.db');
const SALE_END = process.env.SALE_END ?? '2026-12-31';

const on = (name) => ['1', 'true', 'yes', 'on'].includes(String(process.env[name] ?? '').toLowerCase());
const flags = {
  chaos: on('CHAOS_CLASSES'),
  flaky: on('FLAKY'),
  contractBreak: on('CONTRACT_BREAK'),
  slowApi: on('SLOW_API'),
  a11yBugs: on('A11Y_BUGS'),
};

const db = openDb(DB_PATH);
const sessions = new Map(); // token -> userId

// ---------- helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cents = (v) => Math.round(v) / 100;

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}
function json(res, status, data, headers = {}) {
  if (status === 204) return send(res, 204, '', headers);
  send(res, status, JSON.stringify(data), { 'content-type': 'application/json; charset=utf-8', ...headers });
}
function html(res, status, body) {
  send(res, status, body, { 'content-type': 'text/html; charset=utf-8' });
}
function error(res, status, message, extra = {}) {
  json(res, status, { error: message, requestId: res.getHeader('x-request-id'), ...extra });
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error('Invalid JSON body'), { status: 400 });
  }
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie ?? '')
      .split(';')
      .map((p) => p.trim().split('='))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]),
  );
}

function currentUser(req) {
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : parseCookies(req).session;
  const userId = token && sessions.get(token);
  if (!userId) return null;
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId) ?? null;
}

const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, role: u.role });

function cartFor(userId) {
  const rows = db
    .prepare(
      `SELECT p.id AS productId, p.name, c.quantity, p.price_cents
         FROM cart_items c JOIN products p ON p.id = c.product_id
        WHERE c.user_id = ? ORDER BY p.id`,
    )
    .all(userId);
  const items = rows.map((r) => ({
    productId: r.productId,
    name: r.name,
    quantity: r.quantity,
    unitPrice: cents(r.price_cents),
    lineTotal: cents(r.price_cents * r.quantity),
  }));
  const totalCents = rows.reduce((s, r) => s + r.price_cents * r.quantity, 0);
  return { items, count: rows.reduce((s, r) => s + r.quantity, 0), total: cents(totalCents), totalCents };
}

function orderDto(order) {
  const items = db
    .prepare(
      `SELECT oi.product_id AS productId, p.name, oi.quantity, oi.unit_price_cents
         FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`,
    )
    .all(order.id)
    .map((i) => ({ productId: i.productId, name: i.name, quantity: i.quantity, unitPrice: cents(i.unit_price_cents) }));
  return { id: order.id, total: cents(order.total_cents), status: order.status, createdAt: order.created_at, items };
}

const productDto = (p) => ({ id: p.id, name: p.name, price: cents(p.price_cents), category: p.category, stock: p.stock });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- routes ----------
async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const { pathname } = url;
  const method = req.method ?? 'GET';
  res.setHeader('x-request-id', crypto.randomUUID());

  // ----- UI -----
  if (method === 'GET' && pathname === '/') {
    return send(res, 302, '', { location: currentUser(req) ? '/dashboard' : '/login' });
  }
  if (method === 'GET' && pathname === '/login') return html(res, 200, views.loginPage(flags));
  if (method === 'GET' && (pathname === '/dashboard' || pathname === '/cart')) {
    const user = currentUser(req);
    if (!user) return send(res, 302, '', { location: '/login' });
    const { count } = cartFor(user.id);
    const page = pathname === '/dashboard' ? views.dashboardPage : views.cartPage;
    return html(res, 200, page({ user, cartCount: count, flags }));
  }
  const img = pathname.match(/^\/img\/(\d+)\.svg$/);
  if (method === 'GET' && img) {
    return send(res, 200, views.productImage(img[1]), { 'content-type': 'image/svg+xml' });
  }

  // ----- API: public -----
  if (method === 'GET' && pathname === '/api/health') {
    return json(res, 200, { status: 'ok', flags });
  }
  if (method === 'GET' && pathname === '/api/config') {
    return json(res, 200, { saleEnd: SALE_END });
  }

  if (method === 'POST' && pathname === '/api/login') {
    const { email, password } = await readJson(req);
    if (!email || !password) return error(res, 400, 'Email and password are required');
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase());
    if (!user || user.password !== password) return error(res, 401, 'Invalid email or password');
    if (user.locked) return error(res, 423, 'Account is locked');
    const token = crypto.randomBytes(24).toString('hex');
    sessions.set(token, user.id);
    return json(res, 200, { token, user: publicUser(user) }, {
      'set-cookie': `session=${token}; Path=/; HttpOnly; SameSite=Lax`,
    });
  }

  if (method === 'POST' && pathname === '/api/logout') {
    const token = parseCookies(req).session;
    if (token) sessions.delete(token);
    return json(res, 204, null, { 'set-cookie': 'session=; Path=/; Max-Age=0' });
  }

  if (method === 'POST' && pathname === '/api/users') {
    const body = await readJson(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!EMAIL_RE.test(email)) return error(res, 400, 'Invalid email', { field: 'email' });
    if (password.length < 8) return error(res, 400, 'Password must be at least 8 characters', { field: 'password' });
    if (!name || name.length > 50) return error(res, 400, 'Name is required (max 50 characters)', { field: 'name' });
    if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
      return error(res, 409, 'Email already registered');
    }
    // The "role" field in the body is ignored on purpose (security test in exercise 04).
    const { lastInsertRowid } = db
      .prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)')
      .run(email, password, name);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(lastInsertRowid);
    return json(res, 201, publicUser(user));
  }

  if (method === 'GET' && pathname === '/api/products') {
    return json(res, 200, db.prepare('SELECT * FROM products ORDER BY id').all().map(productDto));
  }
  const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
  if (method === 'GET' && productMatch) {
    const id = Number(productMatch[1]);
    if (!Number.isInteger(id) || id < 1) return error(res, 400, 'Product id must be a positive integer');
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return error(res, 404, 'Product not found');
    return json(res, 200, productDto(product));
  }

  if (method === 'GET' && pathname === '/api/search') {
    if (flags.slowApi) await sleep(100 + Math.random() * 700);
    const q = `%${(url.searchParams.get('q') ?? '').trim().toLowerCase()}%`;
    const rows = db.prepare('SELECT * FROM products WHERE lower(name) LIKE ? ORDER BY id').all(q);
    return json(res, 200, rows.map(productDto));
  }

  // ----- API: authenticated -----
  if (!pathname.startsWith('/api/')) return html(res, 404, views.notFoundPage(flags));

  const user = currentUser(req);
  if (!user) return error(res, 401, 'Authentication required');

  if (method === 'GET' && pathname === '/api/me') {
    const nameKey = flags.contractBreak ? 'username' : 'userName';
    return json(res, 200, { id: user.id, email: user.email, [nameKey]: user.name, role: user.role });
  }

  const userMatch = pathname.match(/^\/api\/users\/(\d+)$/);
  if (userMatch && (method === 'GET' || method === 'DELETE')) {
    const id = Number(userMatch[1]);
    if (user.role !== 'admin' && user.id !== id) return error(res, 403, 'Forbidden');
    const target = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!target) return error(res, 404, 'User not found');
    if (method === 'GET') return json(res, 200, publicUser(target));
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    for (const [token, uid] of sessions) if (uid === id) sessions.delete(token);
    return json(res, 204, null);
  }

  if (pathname === '/api/cart') {
    if (method === 'GET') {
      const { totalCents, ...cart } = cartFor(user.id);
      return json(res, 200, cart);
    }
    if (method === 'DELETE') {
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user.id);
      return json(res, 204, null);
    }
    if (method === 'POST') {
      const { productId, quantity = 1 } = await readJson(req);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return error(res, 400, 'Quantity must be an integer between 1 and 99', { field: 'quantity' });
      }
      if (!db.prepare('SELECT 1 FROM products WHERE id = ?').get(productId)) {
        return error(res, 404, 'Product not found');
      }
      if (flags.flaky) await sleep(Math.random() * 600);
      db.prepare(
        `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
         ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity`,
      ).run(user.id, productId, quantity);
      const { totalCents, ...cart } = cartFor(user.id);
      return json(res, 201, cart);
    }
  }

  if (pathname === '/api/orders' && method === 'POST') {
    const cart = cartFor(user.id);
    if (cart.items.length === 0) return error(res, 400, 'Cart is empty');
    const createdAt = new Date().toISOString();
    const { lastInsertRowid } = db
      .prepare('INSERT INTO orders (user_id, total_cents, created_at) VALUES (?, ?, ?)')
      .run(user.id, cart.totalCents, createdAt);
    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)',
    );
    for (const item of cart.items) {
      insertItem.run(lastInsertRowid, item.productId, item.quantity, Math.round(item.unitPrice * 100));
    }
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user.id);
    return json(res, 201, orderDto(db.prepare('SELECT * FROM orders WHERE id = ?').get(lastInsertRowid)));
  }
  if (pathname === '/api/orders' && method === 'GET') {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id').all(user.id);
    return json(res, 200, orders.map(orderDto));
  }
  const orderMatch = pathname.match(/^\/api\/orders\/(\d+)$/);
  if (orderMatch && method === 'GET') {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(orderMatch[1]));
    if (!order || (order.user_id !== user.id && user.role !== 'admin')) return error(res, 404, 'Order not found');
    return json(res, 200, orderDto(order));
  }

  return error(res, 404, 'Endpoint not found');
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!res.headersSent) error(res, e.status ?? 500, e.status ? e.message : 'Internal server error');
    if (!e.status) console.error(e);
  });
});

server.listen(PORT, () => {
  const active = Object.entries(flags).filter(([, v]) => v).map(([k]) => k);
  console.log(`Test Shop running on http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
  console.log(`Active bug flags: ${active.length ? active.join(', ') : 'none'}`);
});

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => server.close(() => process.exit(0)));
