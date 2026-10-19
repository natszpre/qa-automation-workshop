// HTML views of the "Test Shop" app.
// The bug modes (flags) are built in on purpose for the workshop exercises.
import crypto from 'node:crypto';

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

// CHAOS_CLASSES=1 -> classes and ids get a random suffix on every render
// (like CSS Modules / CSS-in-JS). Brittle CSS/XPath selectors stop working.
function classNamer(flags) {
  const suffix = crypto.randomBytes(3).toString('hex');
  return (name) => (flags.chaos ? `${name}_${suffix}` : name);
}

function styles(c, flags) {
  const bannerColor = flags.a11yBugs ? '#c8c8c8' : '#7c2d12';
  return `
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1f2937;background:#f9fafb}
  .${c('topbar')}{display:flex;gap:1rem;align-items:center;padding:.75rem 1.5rem;background:#1e3a8a;color:#fff}
  .${c('topbar')} a{color:#fff;text-decoration:none;font-weight:600}
  .${c('brand')}{margin-right:auto;font-size:1.1rem}
  .${c('container')}{max-width:960px;margin:0 auto;padding:1.5rem}
  .${c('btn')}{border:0;border-radius:6px;padding:.55rem 1rem;font-size:.95rem;cursor:pointer}
  .${c('btn-primary')}{background:#1d4ed8;color:#fff}
  .${c('btn-secondary')}{background:#e5e7eb;color:#111827}
  .${c('btn')}:disabled{opacity:.6;cursor:not-allowed}
  .${c('field')}{display:flex;flex-direction:column;gap:.25rem;margin-bottom:1rem}
  .${c('field')} input{padding:.5rem;border:1px solid #6b7280;border-radius:6px;font-size:1rem}
  .${c('auth')}{max-width:380px;margin:3rem auto;background:#fff;padding:2rem;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
  .${c('error-message')}{color:#b91c1c;margin-top:1rem}
  .${c('banner')}{background:#ffedd5;color:${bannerColor};padding:.75rem 1rem;border-radius:8px;margin:1rem 0;font-weight:600}
  .${c('product-list')}{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem}
  .${c('product-card')}{background:#fff;border-radius:10px;padding:1rem;box-shadow:0 1px 3px rgba(0,0,0,.1);display:flex;flex-direction:column;gap:.5rem}
  .${c('product-card')} h2{font-size:1.05rem;margin:0}
  .${c('price')}{font-weight:700;margin:0}
  .${c('spinner')}{color:#374151;font-style:italic}
  .${c('tip')}{color:#374151;font-size:.9rem}
  table{width:100%;border-collapse:collapse;background:#fff}
  th,td{text-align:left;padding:.5rem;border-bottom:1px solid #e5e7eb}
  .${c('confirmation')}{color:#166534;font-weight:600;margin-top:1rem}
  `;
}

function layout({ title, body, script = '', user, cartCount = 0, flags, c }) {
  const nav = user
    ? `<header class="${c('topbar')}">
        <span class="${c('brand')}">🛒 Test Shop</span>
        <nav aria-label="Main">
          <a href="/dashboard" class="${c('nav-link')}">Dashboard</a>
          <a href="/cart" class="${c('nav-link')} ${c('cart-badge')}" data-testid="cart-badge">Cart (${cartCount})</a>
        </nav>
        ${
          flags.a11yBugs
            ? `<button type="button" class="${c('btn')} ${c('btn-secondary')}" data-testid="logout"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M6 2h7v12H6M2 8h8M7 5l3 3-3 3" stroke="currentColor" fill="none" stroke-width="1.5"/></svg></button>`
            : `<button type="button" class="${c('btn')} ${c('btn-secondary')}" data-testid="logout">Log out</button>`
        }
      </header>`
    : `<header class="${c('topbar')}"><span class="${c('brand')}">🛒 Test Shop</span></header>`;

  const logoutScript = user
    ? `document.querySelector('[data-testid="logout"]').addEventListener('click', async () => {
         await fetch('/api/logout', { method: 'POST' });
         location.href = '/login';
       });`
    : '';

  return `<!doctype html>
<html${flags.a11yBugs ? '' : ' lang="en"'}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Test Shop</title>
<style>${styles(c, flags)}</style>
</head>
<body>
${nav}
<main class="${c('container')}">
${body}
</main>
<script>
const $ = (id) => document.querySelector('[data-testid="' + id + '"]');
const money = (v) => '€' + Number(v).toFixed(2);
const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
${logoutScript}
${script}
</script>
</body>
</html>`;
}

export function loginPage(flags) {
  const c = classNamer(flags);
  const emailField = flags.a11yBugs
    ? `<input id="${c('email')}" name="email" type="email" placeholder="Enter your email" data-testid="login-email">`
    : `<label for="${c('email')}">Email</label>
       <input id="${c('email')}" name="email" type="email" autocomplete="username" placeholder="Enter your email" data-testid="login-email">`;
  const passwordField = flags.a11yBugs
    ? `<input id="${c('password')}" name="password" type="password" placeholder="Enter your password" data-testid="login-password">`
    : `<label for="${c('password')}">Password</label>
       <input id="${c('password')}" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" data-testid="login-password">`;

  const body = `
  <div class="${c('auth')}">
    <h1>Log in</h1>
    <form class="${c('login-form')}" data-testid="login-form" novalidate>
      <div class="${c('field')}">${emailField}</div>
      <div class="${c('field')}">${passwordField}</div>
      <button type="submit" class="${c('btn')} ${c('btn-primary')}" data-testid="login-submit">Log in</button>
      <p class="${c('error-message')}" role="alert" data-testid="login-error"></p>
    </form>
  </div>`;

  const script = `
  const form = $('login-form');
  const err = $('login-error');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const email = $('login-email').value.trim();
    const password = $('login-password').value;
    if (!email || !password) { err.textContent = 'Email and password are required'; return; }
    const btn = $('login-submit');
    btn.disabled = true;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) { location.href = '/dashboard'; return; }
      const data = await res.json();
      err.textContent = data.error;
    } finally {
      btn.disabled = false;
    }
  });`;

  return layout({ title: 'Log in', body, script, flags, c });
}

export function dashboardPage({ user, cartCount, flags }) {
  const c = classNamer(flags);
  const C = JSON.stringify({
    card: c('product-card'),
    price: c('price'),
    btn: `${c('btn')} ${c('btn-primary')}`,
  });

  const body = `
  <h1>Dashboard</h1>
  <p class="${c('greeting')}" data-testid="greeting">Hello!</p>
  <p data-testid="today">Today is <time></time></p>
  <p class="${c('banner')}" data-testid="sale-banner"></p>

  <div role="search" class="${c('field')}">
    <label for="${c('search')}">Search products</label>
    <input id="${c('search')}" type="search" data-testid="search" placeholder="e.g. mug">
  </div>

  <p class="${c('spinner')}" role="status" data-testid="products-loading">Loading products…</p>
  <p class="${c('error-message')}" role="alert" data-testid="products-error"></p>
  <ul class="${c('product-list')}" data-testid="product-list" aria-label="Products"></ul>

  <p class="${c('tip')}" data-testid="tip"></p>`;

  const script = `
  const C = ${C};
  const A11Y_BUGS = ${flags.a11yBugs};
  const escape = (s) => String(s).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 1) "Today" date (browser local time)
  $('today').querySelector('time').textContent = fmtDate(new Date());

  // 2) Sale banner - days counted in UTC (exercise 16)
  fetch('/api/config').then((r) => r.json()).then(({ saleEnd }) => {
    const now = new Date();
    const end = new Date(saleEnd + 'T00:00:00Z');
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const days = Math.round((end.getTime() - today) / 86400000);
    $('sale-banner').textContent =
      days > 1 ? 'Winter sale ends in ' + days + ' days'
      : days === 1 ? 'Winter sale ends tomorrow'
      : days === 0 ? 'Winter sale ends today'
      : 'The winter sale is over';
  });

  // 3) Greeting from /api/me (exercise 15 - API contract)
  fetch('/api/me').then((r) => r.json()).then((me) => {
    $('greeting').textContent = 'Hello, ' + me.userName + '!';
  });

  // 4) Random tip of the day (dynamic content - exercise 27)
  const tips = ['Use getByRole first.', 'Never use sleep().', 'Keep tests independent.', 'Name tests like error messages.'];
  $('tip').textContent = 'Tip of the day: ' + tips[Math.floor(Math.random() * tips.length)];

  // 5) Product list - loaded with a delay (spinner)
  function render(products) {
    const list = $('product-list');
    list.innerHTML = products.map((p) => \`
      <li class="\${C.card}" data-testid="product-card" data-product-id="\${p.id}">
        <img src="/img/\${p.id}.svg" \${A11Y_BUGS ? '' : 'alt="' + escape(p.name) + '"'} width="64" height="64">
        <h2>\${escape(p.name)}</h2>
        <p class="\${C.price}" data-testid="product-price">\${money(p.price)}</p>
        <button type="button" class="\${C.btn}" data-testid="add-to-cart">Add to cart</button>
      </li>\`).join('');
    list.dataset.ready = 'true';
    performance.mark('products-rendered');
  }

  async function loadProducts() {
    await sleep(300 + Math.random() * 900);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      render(await res.json());
    } catch (e) {
      $('products-error').textContent = 'Could not load products. Please try again later.';
    } finally {
      $('products-loading').hidden = true;
    }
  }
  loadProducts();

  // 6) Add to cart
  $('product-list').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-testid="add-to-cart"]');
    if (!btn) return;
    const card = btn.closest('[data-testid="product-card"]');
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId: Number(card.dataset.productId), quantity: 1 }),
    });
    const cart = await res.json();
    $('cart-badge').textContent = 'Cart (' + cart.count + ')';
  });

  // 7) Search
  let t;
  $('search').addEventListener('input', (e) => {
    clearTimeout(t);
    t = setTimeout(async () => {
      const res = await fetch('/api/search?q=' + encodeURIComponent(e.target.value));
      render(await res.json());
    }, 300);
  });`;

  return layout({ title: 'Dashboard', body, script, user, cartCount, flags, c });
}

export function cartPage({ user, cartCount, flags }) {
  const c = classNamer(flags);
  const body = `
  <h1>Cart</h1>
  <p data-testid="cart-empty" hidden>Your cart is empty.</p>
  <table data-testid="cart-table" aria-label="Cart items">
    <thead><tr><th scope="col">Product</th><th scope="col">Quantity</th><th scope="col">Price</th></tr></thead>
    <tbody></tbody>
  </table>
  <p>Total: <strong data-testid="cart-total">€0.00</strong></p>
  <button type="button" class="${c('btn')} ${c('btn-primary')}" data-testid="place-order">Place order</button>
  <p class="${c('confirmation')}" role="status" data-testid="order-confirmation"></p>`;

  const script = `
  async function loadCart() {
    const cart = await (await fetch('/api/cart')).json();
    $('cart-table').querySelector('tbody').innerHTML = cart.items.map((i) =>
      '<tr><td>' + i.name + '</td><td>' + i.quantity + '</td><td>' + money(i.lineTotal) + '</td></tr>').join('');
    $('cart-total').textContent = money(cart.total);
    $('cart-empty').hidden = cart.items.length > 0;
    $('place-order').disabled = cart.items.length === 0;
    $('cart-badge').textContent = 'Cart (' + cart.count + ')';
  }
  $('place-order').addEventListener('click', async () => {
    const res = await fetch('/api/orders', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      $('order-confirmation').textContent =
        'Order #' + data.id + ' confirmed. Placed on ' + fmtDate(new Date(data.createdAt)) + '.';
    } else {
      $('order-confirmation').textContent = data.error;
    }
    await loadCart();
  });
  loadCart();`;

  return layout({ title: 'Cart', body, script, user, cartCount, flags, c });
}

export function notFoundPage(flags) {
  const c = classNamer(flags);
  return layout({ title: 'Not found', body: '<h1>Page not found</h1><p><a href="/">Go home</a></p>', flags, c });
}

export function productImage(id) {
  const colors = ['#1d4ed8', '#9333ea', '#059669', '#b45309', '#be123c', '#0e7490', '#4d7c0f', '#7c3aed'];
  const color = colors[(Number(id) - 1) % colors.length] ?? '#374151';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<rect width="64" height="64" rx="12" fill="${color}"/>
<text x="32" y="41" font-size="26" text-anchor="middle" fill="#fff" font-family="sans-serif">#${Number(id)}</text>
</svg>`;
}
