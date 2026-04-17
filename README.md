# Anashe Fullstack

A fullstack skincare and cosmetics e-commerce application built with Next.js (App Router), Supabase, and M-Pesa checkout.

## Tech Stack

- `Next.js 16` + `React 19` + TypeScript
- `Supabase` (Postgres, Auth, Storage, RLS)
- `Tailwind CSS 4`
- `Zustand` for cart state
- `Zod` for API validation
- `Resend` for email
- `M-Pesa Daraja API` for mobile payments

## Features

- Storefront:
  - Product listing, product detail, categories, search suggestions
  - Cart, checkout, orders, account pages, wishlist
- Admin:
  - Product CRUD (with image upload to Supabase Storage)
  - Category, customer, discount, review, order management pages
- Payments:
  - M-Pesa STK push initiation and callback handling
- Security:
  - Route protection via middleware
  - RLS policies in Supabase migrations

## Project Structure

```text
src/
  app/
    (storefront)/...         # Customer-facing pages
    (admin)/admin/...        # Admin dashboard pages
    api/...                  # Route handlers
  components/                # Reusable UI components
  lib/                       # Utilities, Supabase clients, helpers
  store/                     # Zustand stores
supabase/
  migrations/                # SQL migrations
  seed.sql                   # Seed SQL
  full_setup.sql             # Full DB bootstrap SQL
scripts/
  run-migrations.mjs         # Programmatic migration runner
  seed-db.mjs                # Rich seed data script
```

## Requirements

- Node.js `>= 20`
- npm `>= 10`
- A Supabase project
- M-Pesa Daraja credentials (for payment testing)

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

### Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

### Optional but used by key flows

- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`
- `MPESA_ENV`
- `RESEND_API_KEY`
- `CRON_SECRET`

> Never commit real secrets. Keep `.env.local` private.

## Installation

```bash
npm install
```

## Database Setup

You can set up the database in either of the following ways.

### Option A: Supabase SQL Editor (manual)

Run these files in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_service_bookings.sql`
4. `supabase/migrations/004_storage_product_images_bucket.sql`
5. `supabase/migrations/005_customer_contacts.sql`
6. `supabase/migrations/006_checkout_rls_policies.sql`

Then seed data with:

- `supabase/seed.sql` (basic seed), or
- `node scripts/seed-db.mjs` (expanded sample catalog)

### Option B: Scripted setup

```bash
node scripts/run-migrations.mjs
node scripts/seed-db.mjs
```

> `scripts/run-migrations.mjs` expects a Supabase function `exec_sql` to be available in your project. If it is not available, use Option A via SQL Editor.

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Root (`/`) redirects to `/home`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## API Routes Overview

Core route handlers under `src/app/api` include:

- Products: `/api/products`, `/api/products/[slug]/reviews`
- Admin products: `/api/admin/products`, `/api/admin/products/[id]`
- Admin uploads: `/api/admin/uploads/product-image`
- Admin categories/customers/discounts/reviews
- M-Pesa: `/api/mpesa/stk-push`, `/api/mpesa/callback`
- Account/profile/address and order status routes

## Authentication and Access Control

- Supabase Auth is used for user session handling.
- `src/middleware.ts` protects:
  - `/account`, `/orders`, `/checkout`, `/wishlist` (signed-in users)
  - `/admin` (signed-in users; enforce admin role in server logic where required)

## Image Handling

- Product images are uploaded to Supabase Storage bucket `product-images`.
- Public URLs are persisted in `product_images` table and rendered on storefront/admin.
- `next.config.ts` contains remote image allow-list (`remotePatterns`) for image hosts.

## Deployment Notes

- Ensure production environment variables are set in your hosting provider.
- Configure `MPESA_CALLBACK_URL` to your deployed domain.
- Validate Supabase RLS policies before going live.
- For Vercel cron usage, set `CRON_SECRET`.

## Troubleshooting

- **Images not showing**
  - Confirm image URL exists in `product_images`
  - Confirm storage bucket and policies from `004_storage_product_images_bucket.sql`
  - Confirm allowed host in `next.config.ts`
- **401/Unauthorized in admin API**
  - Confirm authenticated session and server-side auth checks
- **Database script fails**
  - Verify `.env.local` has valid Supabase URL and service role key
  - Run SQL migrations manually in Supabase editor

## Contributing

1. Create a branch
2. Make changes with clear commit messages
3. Run `npm run lint`
4. Open a PR with testing notes

## License

Private project. All rights reserved unless stated otherwise by repository owner.
