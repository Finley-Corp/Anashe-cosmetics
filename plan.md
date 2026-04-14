# Anashe E-Commerce Platform — Implementation Plan
## Skincare & Cosmetics Vertical

**Version:** 1.1.0  
**Stack:** Next.js 14 · Supabase · M-Pesa Daraja API · TailwindCSS · shadcn/ui  
**Architecture:** Monolith (Next.js full-stack)  
**Vertical:** Skincare & Cosmetics (Kenya)

---

## 1. Project Structure

```
anashe/
├── app/                          # Next.js App Router
│   ├── (storefront)/             # Public-facing routes
│   │   ├── home/page.tsx         # Homepage: hero, concerns, routines, trending
│   │   ├── products/
│   │   │   ├── page.tsx          # Product listing + skincare filters
│   │   │   └── [slug]/page.tsx   # Product detail with shade selector + ingredients
│   │   ├── categories/[slug]/    # Category listing (e.g. /categories/serums-treatments)
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx          # Order history
│   │   │   └── [id]/page.tsx     # Order detail
│   │   ├── wishlist/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx          # Profile + recent orders
│   │   │   ├── skin-profile/page.tsx  # Skin type & concerns settings
│   │   │   └── addresses/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── about/page.tsx
│   │   ├── blog/page.tsx
│   │   └── contact/page.tsx
│   ├── (admin)/                  # Admin dashboard routes
│   │   ├── admin/
│   │   │   ├── page.tsx          # Analytics overview
│   │   │   ├── products/         # Skincare product management
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── coupons/
│   │   │   ├── reviews/
│   │   │   ├── settings/
│   │   │   └── analytics/
│   ├── api/                      # API routes (backend)
│   │   ├── products/
│   │   │   ├── route.ts          # Skincare filter support
│   │   │   └── [slug]/route.ts
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── mpesa/
│   │   │   ├── stk-push/route.ts
│   │   │   └── callback/route.ts
│   │   ├── orders/
│   │   ├── reviews/
│   │   ├── coupons/
│   │   ├── analytics/
│   │   └── recommendations/
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── storefront/               # Storefront-specific components
│   │   ├── Navbar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── ProductCard.tsx       # Shows skin type badges, vegan/CF icons
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx    # Includes skin type, concern, SPF, shade filters
│   │   ├── SearchBar.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ShadeSelector.tsx     # Circular swatch grid for color cosmetics
│   │   ├── IngredientsList.tsx   # Collapsible with irritant highlights
│   │   ├── SkinTypeBadges.tsx    # Pill badges for compatible skin types
│   │   ├── ConcernTags.tsx       # Tag pills for skin concerns addressed
│   │   ├── CertBadges.tsx        # Vegan / Cruelty-Free / Natural icons
│   │   ├── ReviewCard.tsx
│   │   ├── RoutineBuilder.tsx    # "Build your routine" stepper component
│   │   └── RecommendationCarousel.tsx
│   ├── admin/                    # Admin dashboard components
│   │   ├── Sidebar.tsx
│   │   ├── DataTable.tsx
│   │   ├── ChartCard.tsx
│   │   └── ProductForm.tsx       # Extended with skincare-specific fields
│   └── shared/
│       ├── MpesaModal.tsx
│       └── LoadingSkeleton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── mpesa/
│   │   ├── auth.ts
│   │   ├── stk-push.ts
│   │   └── callback.ts
│   ├── email/
│   │   └── resend.ts             # Beauty-branded email sender
│   ├── search/
│   │   └── query-builder.ts      # Supports skincare attribute filters
│   ├── recommendations/
│   │   └── engine.ts             # Skin-type aware recommendation logic
│   ├── analytics/
│   │   └── tracker.ts
│   └── utils.ts
├── hooks/
│   ├── useCart.ts
│   ├── useWishlist.ts
│   ├── useSearch.ts
│   └── useCheckout.ts
├── types/
│   ├── database.types.ts
│   └── index.ts                  # Includes skincare-specific Product fields
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql    # Full schema with skincare fields
│   │   └── 002_rls_policies.sql
│   ├── seed.sql                      # 40-50 skincare & cosmetic products
│   └── full_setup.sql                # Combined migration + seed
├── emails/                           # React Email templates (beauty copy)
│   ├── OrderConfirmation.tsx
│   ├── AbandonedCart1.tsx
│   ├── AbandonedCart2.tsx
│   ├── AbandonedCart3.tsx
│   ├── WelcomeEmail.tsx
│   └── WishlistSaleAlert.tsx
├── public/
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 2. Architecture Diagram

```
Browser / Mobile
      │
      ▼
┌─────────────────────────────┐
│     Next.js 14 (Monolith)   │
│  ┌──────────┐ ┌───────────┐ │
│  │ App      │ │ API       │ │
│  │ Router   │ │ Routes    │ │
│  │ (RSC +   │ │ /api/**   │ │
│  │  Client) │ │           │ │
│  └────┬─────┘ └─────┬─────┘ │
└───────┼─────────────┼───────┘
        │             │
        ▼             ▼
  ┌───────────────────────┐
  │     Supabase          │
  │  ┌──────┐ ┌────────┐  │
  │  │ Auth │ │  DB    │  │
  │  └──────┘ │(Postgres│  │
  │  ┌──────┐ │+ RLS)  │  │
  │  │Store │ └────────┘  │
  │  │ age  │ ┌────────┐  │
  │  └──────┘ │Realtime│  │
  │           └────────┘  │
  └───────────────────────┘
        │
        ▼
  ┌───────────────┐    ┌───────────┐
  │ Safaricom     │    │  Resend   │
  │ Daraja API    │    │  (Email)  │
  │ (M-Pesa)      │    └───────────┘
  └───────────────┘
```

---

## 3. Development Phases

---

### Phase 0 — Project Setup (Days 1–2)

**Goal:** Running development environment with auth working.

Steps:
1. `npx create-next-app@latest anashe --typescript --tailwind --app`
2. Install dependencies: `@supabase/supabase-js @supabase/ssr shadcn/ui zod react-hook-form lucide-react resend`
3. Configure Supabase project (create project, get URL + publishable key)
4. Set up environment variables (`.env.local`)
5. Configure Supabase client (browser + server + middleware)
6. Generate Supabase types: `supabase gen types typescript`
7. Configure TailwindCSS theme (brand colors: deep green primary, warm gold accent)
8. Initialize shadcn/ui components
9. Set up Next.js middleware for route protection
10. Set up Supabase Auth (email/password)
11. Create base layouts (storefront + admin)
12. Deploy to Vercel (connect repo, set env vars)

**Deliverable:** Running app at localhost and Vercel with login/register working.

---

### Phase 1 — Database & Core Models (Days 3–5)

**Goal:** All tables created with RLS policies, skincare seed data in place.

Steps:
1. Write migration: `001_initial_schema.sql` (all tables including skincare-specific columns)
2. Enable extensions: `pg_trgm`, `unaccent`, `pgcrypto`
3. Write RLS policies for every table
4. Create Supabase Storage bucket for product images (`products/`, `avatars/`)
5. Write seed data:
   - 14 skincare/cosmetic categories
   - 40–50 realistic skincare & cosmetic products with Kenyan pricing (KES 500–8,000)
   - At least 8 makeup products with `shade` + `shade_hex` values
   - All products with `skin_type`, `concerns`, `ingredients`, `volume_ml` populated
6. Generate updated TypeScript types
7. Verify all policies with Supabase Studio

**Key SQL Functions:**
- `update_product_search_vector()` — includes `ingredients`, `concerns`, and `skin_type` in search index
- `update_product_rating()` — trigger on `reviews` insert/update
- `decrement_stock()` — called on order confirmation
- `track_event()` — insert into `analytics_events`

**New product columns vs. generic schema:**
```sql
-- Skincare-specific columns added to products table
skin_type    TEXT[]    DEFAULT '{}',  -- e.g. ARRAY['oily','combination']
concerns     TEXT[]    DEFAULT '{}',  -- e.g. ARRAY['acne','hyperpigmentation']
ingredients  TEXT,                    -- full INCI list as plain text
volume_ml    NUMERIC(6,1),            -- 30.0, 50.0, 100.0 ml
finish       TEXT,                    -- matte | dewy | satin | glossy | natural
shade        TEXT,                    -- shade name for color cosmetics
shade_hex    TEXT,                    -- '#C4956A' for swatch rendering
spf          INT,                     -- SPF value, NULL for non-SPF products
is_vegan        BOOLEAN DEFAULT FALSE,
is_cruelty_free BOOLEAN DEFAULT FALSE,
is_natural      BOOLEAN DEFAULT FALSE,

-- User skin profile columns added to profiles table
skin_type    TEXT,     -- 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal'
skin_concerns TEXT[]   DEFAULT '{}'
```

---

### Phase 2 — Product Catalog (Days 6–10)

**Goal:** Complete skincare product browsing experience.

**New skincare-specific components:**
- `ShadeSelector` — circular color swatch grid; clicking selects shade and may update price
- `IngredientsList` — collapsible accordion; auto-highlights known irritants (regex match against list)
- `SkinTypeBadges` — pill badges row: "Oily · Combination · All Skin Types"
- `ConcernTags` — tag row: "Acne", "Hydration", "Anti-Aging"
- `CertBadges` — small icons: 🌿 Vegan, 🐰 Cruelty-Free, 🌱 Natural
- `RoutineBuilder` — "Build Your Routine" step display (Cleanser → Toner → Serum → Moisturiser → SPF)
- `RecommendationCarousel` — "Trending in Skincare" + "Trending in Makeup" as separate carousels

**Updated `ProductFilters` — skincare filter panel:**
```
Skin Type (multi-select checkboxes)
  □ All Skin Types
  □ Oily
  □ Dry
  □ Combination
  □ Sensitive

Skin Concern (multi-select checkboxes)
  □ Acne & Blemishes
  □ Anti-Aging
  □ Hyperpigmentation
  □ Hydration & Moisture
  □ Brightening
  □ Dark Circles
  □ Pores

Finish (makeup categories only)
  ○ All  ○ Matte  ○ Dewy  ○ Satin  ○ Glossy

SPF (sunscreen category only)
  Slider: 0 — 50+

Certifications
  □ Vegan
  □ Cruelty-Free
  □ Natural / Organic

Price Range
  KES _____ — KES _____

Availability
  □ In Stock Only
```

**API Route:** `GET /api/products` — extended filter params:
```
?skin_type[]=oily&skin_type[]=dry
?concerns[]=acne&concerns[]=anti-aging
?finish=matte
?spf_min=30&spf_max=50
?is_vegan=true&is_cruelty_free=true
?shade=warm-beige  (for color cosmetics)
```

**SQL Filter Examples:**
```sql
-- Skin type filter (product's skin_type array overlaps with requested types)
AND products.skin_type && ARRAY['oily','combination']::TEXT[]

-- Concerns filter (product's concerns array overlaps)
AND products.concerns && ARRAY['acne','hyperpigmentation']::TEXT[]

-- Certifications filter
AND (is_vegan = TRUE AND is_cruelty_free = TRUE)

-- SPF range
AND spf BETWEEN 30 AND 50

-- Search includes ingredients
AND search_vector @@ to_tsquery('english', 'vitamin C')
```

**Pages:**
- `/products` — listing with skincare filters
- `/products/[slug]` — product detail with shade selector, ingredients, skin type badges
- `/categories/[slug]` — category listing (e.g. `/categories/serums-treatments`)

---

### Phase 3 — Cart & Wishlist (Days 11–13)

**Goal:** Persistent cart and wishlist for authenticated users; session cart for guests.

Implementation:
- Cart state managed with Zustand + server sync
- Guest cart stored in `localStorage`, merged on login
- `CartDrawer` (slide-out panel, not full page)
- Real-time stock validation on add-to-cart
- Wishlist toggle with optimistic UI
- Wishlist triggers email if wishlisted product goes on sale

API Routes:
- `GET /api/cart` — get current cart
- `POST /api/cart/items` — add item
- `PATCH /api/cart/items/[id]` — update quantity
- `DELETE /api/cart/items/[id]` — remove item
- `POST /api/cart/merge` — merge guest cart on login
- `GET/POST/DELETE /api/wishlist` — wishlist CRUD

---

### Phase 4 — M-Pesa Checkout (Days 14–18)

**Goal:** Complete, tested M-Pesa payment flow.

**Checkout Flow:**
1. Review cart → enter/confirm delivery address
2. Apply coupon (optional)
3. Order summary with total
4. Enter M-Pesa phone number
5. Click "Pay KES X,XXX via M-Pesa"
6. Backend creates order (status: `pending_payment`) + calls STK Push
7. Show "Check your phone" waiting screen
8. Poll `/api/orders/[id]/status` every 3s
9. On success: navigate to `/orders/[id]` confirmation
10. On failure/timeout: show error + retry option

**M-Pesa STK Push Implementation:**
```typescript
// lib/mpesa/stk-push.ts
export async function initiateSTKPush({
  phone, amount, orderId, callbackUrl
}: STKPushParams) {
  const token = await getMpesaToken();
  const timestamp = getTimestamp();
  const password = generatePassword(timestamp);

  const baseUrl = process.env.MPESA_ENV === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke'
    : 'https://api.safaricom.co.ke';

  const response = await fetch(
    `${baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formatPhone(phone),
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formatPhone(phone),
        CallBackURL: callbackUrl,
        AccountReference: `ANASHE-${orderId}`,
        TransactionDesc: 'Anashe Beauty Order'
      })
    }
  );
  return response.json();
}
```

---

### Phase 5 — Admin Dashboard (Days 19–25)

**Goal:** Full admin interface for beauty operations.

Admin Pages:
- `/admin` — Analytics overview (KPI cards + charts)
- `/admin/products` — Table with search, filter, bulk actions
- `/admin/products/new` — Product creation form with skincare fields
- `/admin/products/[id]/edit` — Edit product
- `/admin/categories` — Category tree management
- `/admin/orders` — Orders table with status filter
- `/admin/orders/[id]` — Order detail + status update
- `/admin/customers` — Customer list + skin profile view
- `/admin/coupons` — Coupon CRUD
- `/admin/reviews` — Review moderation queue
- `/admin/analytics` — Detailed reports + date range
- `/admin/settings` — Site settings

**Admin Product Form — field groups:**

```
[Basic Information]
  Product Name *
  Brand *
  SKU *
  Category * (dropdown: 14 skincare/cosmetic categories)
  Short Description *
  Full Description (rich text)
  Slug (auto-generated, editable)

[Pricing & Inventory]
  Price (KES) *
  Sale Price (KES)
  Cost Price (KES)
  Stock Quantity *
  Low Stock Alert Threshold
  Volume / Size (ml)

[Skincare Attributes]
  Skin Type (multi-select checkboxes)
    □ All Skin Types  □ Oily  □ Dry  □ Combination  □ Sensitive
  Skin Concerns (multi-select checkboxes — labelled "Skin Concerns", not "Tags")
    □ Acne  □ Anti-Aging  □ Hyperpigmentation  □ Hydration
    □ Brightening  □ Dark Circles  □ Pores  □ Redness
  Ingredient List (textarea — full INCI names)
  Finish (select: Matte / Dewy / Satin / Glossy / Natural / N/A)
  SPF Value (number input — leave blank if N/A)

[Colour / Shade (for color cosmetics)]
  Shade Name (text)
  Shade HEX Color (#XXXXXX — shows live color preview)

[Certifications]
  □ Vegan
  □ Cruelty-Free
  □ Natural / Organic

[Images]
  Image upload (multiple, drag-to-reorder)
  Primary image selector

[SEO]
  Meta Title
  Meta Description (mention key ingredients / skin type)

[Visibility]
  □ Published
  □ Featured
```

---

### Phase 6 — Email & Notifications (Days 26–28)

**Goal:** All transactional emails sent with beauty-brand voice.

Emails to implement (using Resend + React Email):

| Template | Subject | Trigger |
|----------|---------|---------|
| `WelcomeEmail.tsx` | "Start your skincare journey with Anashe ✨" | User registration |
| `OrderConfirmation.tsx` | "Order confirmed — your beauty essentials are on their way" | Payment success |
| `OrderStatusUpdate.tsx` | "Your Anashe order is [status]" | Any status change |
| `AbandonedCart1.tsx` | "Your skincare picks are waiting 🌿" | 1 hour after abandonment |
| `AbandonedCart2.tsx` | "Don't forget your routine essentials" | 24 hours (with optional coupon) |
| `AbandonedCart3.tsx` | "Last chance — your cart expires soon" | 72 hours |
| `WishlistSaleAlert.tsx` | "A product on your wishlist just went on sale! 💛" | Sale price set on wishlisted product |
| `PostPurchaseRec.tsx` | "Complete your skincare routine" | 3 days after delivery |

**Abandoned Cart Cron:**
- Vercel Cron Job (`/api/cron/abandoned-carts`) runs every 30 minutes
- Queries `carts` where `updated_at < now() - interval '1 hour'` and user has not placed order
- Sends appropriate email based on `abandoned_email_count` field

---

### Phase 7 — SEO & Performance (Days 29–31)

**Goal:** All SEO requirements implemented, Core Web Vitals green.

**Skincare-specific SEO checklist:**
- [ ] `generateMetadata()` on all page routes — meta descriptions mention skin type and key ingredients
  - Example: `"Anashe Vitamin C Brightening Serum 30ml — best for oily and combination skin. Fights hyperpigmentation with 15% L-ascorbic acid. Shop in Kenya, pay via M-Pesa."`
- [ ] JSON-LD `Product` schema with skincare additionalProperty:
  ```json
  {
    "@type": "Product",
    "name": "Vitamin C Brightening Serum",
    "description": "...",
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Skin Type", "value": "Oily, Combination" },
      { "@type": "PropertyValue", "name": "Skin Concern", "value": "Hyperpigmentation, Brightening" },
      { "@type": "PropertyValue", "name": "Volume", "value": "30ml" },
      { "@type": "PropertyValue", "name": "SPF", "value": "None" }
    ],
    "material": "Aqua, Ascorbic Acid 15%, Niacinamide, Hyaluronic Acid..."
  }
  ```
- [ ] `FAQPage` JSON-LD on category pages:
  - `/categories/serums-treatments`: "What is a serum?", "How do I layer serums?", "Best serum for oily skin?"
  - `/categories/sunscreen-spf`: "What SPF should I use daily?", "Is SPF 30 enough in Kenya?"
- [ ] `app/sitemap.ts` — dynamic sitemap with all product and category URLs
- [ ] `app/robots.ts` — block admin, allow products/categories
- [ ] Canonical URLs on all pages
- [ ] Open Graph images (product image as OG image)
- [ ] All product images: `next/image` with descriptive alt text
- [ ] Font optimization: `next/font/google` (Inter + Crimson Pro)
- [ ] Bundle analysis: `@next/bundle-analyzer`

---

### Phase 8 — Security Hardening (Days 32–33)

**Goal:** OWASP Top 10 addressed, data encrypted, rate limiting in place.

Checklist:
- [ ] Zod validation on all API inputs (extended for skincare filter params)
- [ ] SQL injection: use Supabase parameterized queries only
- [ ] XSS: DOMPurify for rich text (product descriptions, reviews)
- [ ] CSRF: Next.js handles via same-site cookies; verify on mutations
- [ ] Rate limiting on `/api/auth/*`, `/api/checkout/*`
- [ ] M-Pesa callback: validate `CheckoutRequestID` exists in DB before processing
- [ ] Supabase RLS: test all policies with non-privileged user
- [ ] Secrets: confirm no keys in code/committed files
- [ ] HTTP headers: security headers via Next.js config
- [ ] PII: encrypt phone numbers at rest with pgcrypto
- [ ] Ingredient list: sanitize HTML, no script injection via INCI text

---

### Phase 9 — QA, Testing & Launch (Days 34–40)

**Goal:** Production-ready, tested, deployed.

Testing:
- Unit tests: `vitest` for utility functions (price formatting, phone validation, shade hex validation, skin type filter logic)
- Integration tests: API route tests with Supabase test project
- E2E tests: `Playwright` for critical paths
  1. Browse by concern → filter by skin type → product detail → add to cart → checkout
  2. Shade selector changes displayed swatch → correct variant added to cart
  3. Admin: create product with skincare fields → verify on storefront with badges
- Manual testing: full checkout flow with real M-Pesa production credentials

Launch Steps:
1. Set Supabase to production mode
2. Confirm M-Pesa Daraja production credentials (`MPESA_ENV=production`)
3. Point domain `siscom.africa` to Vercel
4. Enable Vercel Analytics
5. Submit sitemap to Google Search Console
6. Smoke test all critical paths on production

---

## 4. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tkdqamzaqarmfoxxtypw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=              # Required for migrations and admin ops

# M-Pesa Daraja (Production)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=4148853
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://siscom.africa/api/mpesa/callback
MPESA_ENV=production                   # sandbox | production

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://siscom.africa
CRON_SECRET=                           # For securing Vercel cron routes
```

---

## 5. Key Dependencies

```json
{
  "dependencies": {
    "next": "^16",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.x",
    "zod": "^3",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "zustand": "^4",
    "resend": "^3",
    "@react-email/components": "^0",
    "lucide-react": "latest",
    "recharts": "^2",
    "isomorphic-dompurify": "^2",
    "date-fns": "^3",
    "slugify": "^1"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "vitest": "^1",
    "@playwright/test": "^1",
    "supabase": "^2",
    "@next/bundle-analyzer": "latest"
  }
}
```

---

## 6. Deployment Architecture

```
GitHub Repo
    │
    ▼ Push to main
Vercel (Auto-deploy)
    │
    ├── Edge Middleware (Auth checks)
    ├── App Router (SSR + SSG + ISR)
    ├── API Routes (Node.js runtime)
    └── Vercel Cron Jobs (/api/cron/abandoned-carts)
              │
              ▼
         Supabase (managed Postgres + Auth + Storage)
              │
              ▼
         Safaricom Daraja API (M-Pesa Production)
         Resend (Transactional Email)
```

---

## 7. Timeline Summary

| Phase | Description | Days | Cumulative |
|-------|-------------|------|-----------|
| 0 | Project Setup | 2 | 2 |
| 1 | Database & Core Models (skincare schema) | 3 | 5 |
| 2 | Product Catalog (skincare filters, shade selector, ingredients) | 5 | 10 |
| 3 | Cart & Wishlist | 3 | 13 |
| 4 | M-Pesa Checkout | 5 | 18 |
| 5 | Admin Dashboard (skincare product form) | 7 | 25 |
| 6 | Email & Notifications (beauty copy) | 3 | 28 |
| 7 | SEO & Performance (skincare JSON-LD, FAQ schema) | 3 | 31 |
| 8 | Security Hardening | 2 | 33 |
| 9 | QA, Testing & Launch | 7 | **40** |

**Total Estimated Duration: 40 working days (~8 weeks)**
