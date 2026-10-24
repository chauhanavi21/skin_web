# Bloom — skincare & haircare store

Full-stack demo e-commerce site. React (Vite) frontend, Node/Express + SQLite backend. Everything runs locally.

## Run it

Needs Node 22.13+ (uses the built-in `node:sqlite`).

```powershell
# terminal 1 — API on http://localhost:4000
cd backend
npm install
npm run dev

# terminal 2 — site on http://localhost:5173
cd frontend
npm install
npm run dev
```

The catalog (26 skin, hair and body products) is seeded automatically on first start. `npm run seed` in `backend` resets it, unless orders already exist.

## Features

- Browse, filter by category and product type, search, and sort
- Product pages with ingredients, stock warnings and related products
- Cart persisted in the browser, free shipping over $50
- Accounts (register / sign in, scrypt-hashed passwords, JWT sessions)
- Checkout and order history. Prices and stock are always checked on the server, and stock is decremented in a transaction.

## Notes

- **Payments are a local stand-in**: placing an order marks it `paid`. Real payment and email providers are intentionally not wired up yet.
- The JWT signing key is generated into `backend/data/jwt.secret` (gitignored), or set `JWT_SECRET`.
- The database lives in `backend/data/ecom.db` (gitignored). Delete it to start fresh.
- Product photos are free Unsplash images stored locally in `frontend/public/images/products/<slug>.jpg`. Several slugs share a stock photo, so swap in real product shots when you have them.
- Styling is Tailwind CSS 3.4 with a sky-blue palette (`frontend/tailwind.config.js`, `frontend/src/styles.css`). Fonts are bundled locally via `@fontsource`, so the site makes no third-party requests.

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/products` | `category`, `type`, `q`, `sort`, `featured=1` |
| GET | `/api/products/meta` | categories and types with counts |
| GET | `/api/products/:slug` | includes `related` |
| POST | `/api/auth/register`, `/api/auth/login` | returns `{ token, user }` |
| GET | `/api/auth/me` | auth required |
| GET, POST | `/api/orders` | auth required |
| GET | `/api/orders/:id` | own orders only |
