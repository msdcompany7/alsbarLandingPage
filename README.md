# Alsbar Landing Page (S.Light)

Public marketing website for **S.Light / חשמל אלסבינר** — product catalog, contact form, and admin CMS.

## Requirements

- Node.js 20+
- PostgreSQL (Docker recommended)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env — set WEBSITE_DATABASE_URL, AUTH_SECRET, AUTH_URL

npm run db:push
npm run db:seed
npm run dev
```

Open **http://localhost:3002**

## Admin

- URL: `/admin/login`
- Default (after seed): `admin@electricity-shop.local` / `Admin123!`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3002) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run db:push` | Apply Prisma schema |
| `npm run db:seed` | Seed admin, categories, products |

## Docker (PostgreSQL)

```bash
docker compose up -d postgres
```

Use connection string from `.env.example`.
