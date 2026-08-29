# Alsbar Landing Page (S.Light)

Public marketing website for **S.Light / חשמל אלסבינר** — product catalog, contact form, and admin CMS.

Backend: **Firebase** (Firestore, Authentication, Storage, Admin SDK)

## Requirements

- Node.js 20+
- Firebase project with Firestore, Authentication (Email/Password), and Storage enabled

## Setup

```bash
npm install
cp .env.example .env
# Edit .env — set Firebase client + admin variables (see below)

npm run firebase:create-admin
npm run dev
```

Open **http://localhost:3002**

## Admin

- URL: `/admin/login`
- Uses Firebase Authentication email/password
- Default after `firebase:create-admin`: values from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3002) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run firebase:create-admin` | Create/update Firebase Auth admin user |
| `npm run firebase:seed` | Optional sample data for empty Firestore (`ALLOW_SAMPLE_SEED=true`) |

## Firebase Console checklist

1. Create a Firebase project
2. Enable **Authentication → Email/Password**
3. Create **Firestore** database
4. Create **Storage** bucket
5. Deploy rules and indexes (see `firebase/` and `firebase.json`)
6. Create a **Service Account** key for Admin SDK (server)
7. Copy web app config for client SDK (public env vars)

## Deploy Firebase rules and indexes

From the project root, after `firebase login` and `firebase use alsbar-landingpage`:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Environment variables

See `.env.example` for the full list. Never put Admin private keys in `NEXT_PUBLIC_*` variables.

Utility scripts load `.env` via `tsx --env-file=.env` and `scripts/load-env.ts`.
