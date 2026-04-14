# Product Requirements Document (PRD)
## Anashe E-Commerce Platform — Skincare & Cosmetics

**Version:** 1.1.0  
**Date:** April 2026  
**Status:** Draft  
**Vertical:** Skincare & Cosmetics  
**Payment Gateway:** M-Pesa (Kenya)  
**Architecture:** Monolithic  
**Database:** Supabase (PostgreSQL)

---

## 1. Executive Summary

Anashe is a full-stack, mobile-first e-commerce platform built exclusively for skincare and cosmetic products, designed for the Kenyan market and accepting M-Pesa payments only. Built as a monolithic application on a modern stack, it offers a complete beauty retail experience — from skin-type-matched product discovery to order fulfillment — with built-in analytics, marketing tools, and SEO optimization. Every feature is tailored to the beauty shopper: shade selectors, ingredient lists, skin type filters, concern-based browsing, and routine-building recommendations.

---

## 2. Goals & Objectives

| Goal | Success Metric |
|------|---------------|
| Seamless M-Pesa checkout | ≥ 95% payment success rate |
| Mobile-first beauty experience | Lighthouse mobile score ≥ 90 |
| Skin-type personalization | ≥ 30% of sessions use skin-type or concern filters |
| High discoverability | Core Web Vitals all green; structured data on all product pages |
| Operational efficiency | Orders fulfilled and status-updated within platform |
| Revenue growth | Coupon redemption, abandoned cart recovery, routine bundles drive ≥ 15% AOV uplift |

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TailwindCSS, shadcn/ui |
| Backend | Next.js API Routes (monolith) |
| Database | Supabase (PostgreSQL + Realtime + Auth + Storage) |
| Payments | Safaricom M-Pesa Daraja API (STK Push + C2B) |
| Auth | Supabase Auth (email/password + OAuth) |
| Search | PostgreSQL full-text search + `pg_trgm` extension |
| Email | Resend (transactional emails) |
| File Storage | Supabase Storage (product images, shade swatches, assets) |
| Hosting | Vercel (or Railway for monolith) |
| Analytics | Self-hosted with Supabase + custom dashboards |
| SEO | Next.js Metadata API, sitemap.xml, robots.txt, JSON-LD |

---

## 4. User Roles

### 4.1 Customer (Shopper)
- Browse and search skincare & cosmetic products
- Create account, manage profile, addresses, and **skin profile**
- Add to cart and wishlist
- Checkout via M-Pesa STK Push
- Track orders and view history
- Write product reviews
- Apply coupons/discount codes
- Receive personalized recommendations based on skin type and concerns

### 4.2 Admin
- Full dashboard access
- Manage products (including skincare-specific fields: skin type, concerns, ingredients, shades)
- Manage categories, inventory
- View and manage orders (OMS)
- Create and manage discount/coupon campaigns
- View analytics and reports
- Configure site settings, SEO, banners
- Moderate reviews
- Manage customers

### 4.3 Guest
- Browse and search
- Add to cart (session-based)
- Must register/login to checkout

---

## 5. Feature Specifications

---

### 5.1 Advanced Search & Filtering

**Description:** Full-text product search with multi-faceted filtering tailored to the beauty shopper.

**Functional Requirements:**
- Search by product name, description, brand, category, ingredients using PostgreSQL `tsvector` + `tsquery`
- Trigram fuzzy matching via `pg_trgm` for typo tolerance (e.g. "moisturizer" → "moisturiser")
- **Skincare-specific filters:**
  - Skin type (multi-select): Oily, Dry, Combination, Sensitive, All Skin Types
  - Skin concern (multi-select): Acne, Anti-Aging, Hyperpigmentation, Hydration, Brightening, Dark Circles, Pores, Redness
  - Finish (for makeup): Matte, Dewy, Satin, Glossy, Natural
  - SPF range slider (for sunscreen category): SPF 15 / 30 / 50 / 50+
  - Certifications: Vegan, Cruelty-Free, Natural/Organic (checkboxes)
  - Shade swatch color picker (Foundation, Concealer, Lip Color categories)
- **Standard filters:** category, price range (slider), brand, rating, availability
- Sort by: relevance, price (asc/desc), newest, best-selling, highest-rated
- Search results pagination (infinite scroll on mobile, numbered on desktop)
- URL-persisted filter state (shareable filtered URLs)
- Search suggestions / autocomplete (debounced, 300ms)
- "No results" state with suggested categories and concern-based alternatives

**Non-Functional Requirements:**
- Search response < 300ms for up to 100k products
- Filters update results without full page reload

---

### 5.2 Mobile-First Design

**Description:** All UI built and tested for mobile (320px+) first, then enhanced for desktop.

**Functional Requirements:**
- Responsive layout at breakpoints: 320px, 480px, 768px, 1024px, 1280px
- Touch-optimized tap targets (≥ 44x44px)
- Bottom navigation bar on mobile
- Swipeable product image galleries
- Native-feel modals and drawers (not full-page redirects)
- Sticky cart/checkout button on product and listing pages
- Skeleton loaders (no layout shift)
- Touch-friendly shade swatch selectors

**Non-Functional Requirements:**
- First Contentful Paint < 1.5s on 4G
- Cumulative Layout Shift < 0.1
- Lighthouse mobile performance ≥ 90

---

### 5.3 Detailed Product Pages

**Description:** Rich, conversion-optimized product detail pages tailored to beauty shoppers.

**Functional Requirements:**
- Multiple product images with zoom and swipe gallery
- Product name, brand, SKU, price, sale price, stock status badge
- Short and long descriptions (rich text)
- **Skincare-specific UI sections:**
  - **Skin type compatibility badges:** pill badges showing compatible skin types (e.g. "Oily · Combination")
  - **Concerns addressed tags:** e.g. "Acne", "Hyperpigmentation", "Anti-Aging"
  - **Volume / size display:** e.g. "30ml", "50ml"
  - **SPF badge:** prominent badge for sunscreen products (e.g. "SPF 50+")
  - **Shade selector:** circular color swatch grid for color cosmetics (foundation, lipstick, blush), using `shade_hex` to render exact color
  - **Full ingredient list:** collapsible accordion with INCI names; auto-highlight known irritants (fragrance, alcohol, parabens)
  - **"How to use" section:** application instructions
  - **Certification badges:** Vegan / Cruelty-Free / Natural icons
- Variant selector for size/volume options (updates price/stock dynamically)
- Add to Cart and Add to Wishlist CTAs
- Quantity selector with stock validation
- Breadcrumb navigation
- Related products carousel ("Complete your routine" from same brand/category)
- Reviews & ratings section (see 5.8)
- Social share buttons
- Structured data (JSON-LD: `Product`, `AggregateRating`, `Offer` with ingredients and additionalProperty)
- Stock level indicator ("Only 3 left!")
- Estimated delivery info

**Non-Functional Requirements:**
- Page must be server-side rendered (SSR) or statically generated (ISR) for SEO

---

### 5.4 Wishlists

**Description:** Authenticated users can save products to personal wishlists.

**Functional Requirements:**
- Add/remove product from wishlist via heart icon (toggled)
- Dedicated `/wishlist` page listing all saved items
- Move item from wishlist to cart
- Wishlist persists across sessions
- If a wishlisted product goes on sale, trigger notification (email/in-app)
- Share wishlist via link (optional, v1.1)

---

### 5.5 Product Reviews & Ratings

**Description:** Verified-purchase review system with star ratings, relevant to skincare.

**Functional Requirements:**
- 1–5 star rating with written review
- Only customers who purchased the product may review it
- Review includes: rating, title, body, reviewer name, skin type (optional tag), date
- Admin can approve/reject reviews (moderation queue)
- Aggregate rating displayed on product listing and detail pages
- Sort reviews by: newest, highest, lowest, most helpful
- Mark review as helpful (thumbs up)
- Paginate reviews (5 per page default)

---

### 5.6 Order Management System (OMS)

**Description:** Full lifecycle order management for admins and customers.

**Customer-Facing:**
- View all past orders with status
- Order detail: items, quantities, prices, shipping address, payment reference, timeline
- Order statuses: `Pending Payment` → `Payment Confirmed` → `Processing` → `Shipped` → `Delivered` → `Cancelled` / `Refunded`
- Cancel order (if still in `Pending` or `Processing`)
- Download invoice (PDF)

**Admin-Facing:**
- Orders list with filters: status, date range, customer, payment reference
- Order detail view with full customer and item info
- Manual status update with optional note
- Bulk status update
- Export orders to CSV
- M-Pesa transaction reference tied to every order
- Refund tracking (manual, logged)

**Automated Triggers:**
- Email confirmation on order placement ("Your beauty essentials are on their way")
- Email on status change
- Low stock alert to admin when inventory < threshold

---

### 5.7 Discount & Coupon Engine

**Description:** Flexible promotion system for skincare and makeup discounts.

**Functional Requirements:**
- Coupon types: percentage off, fixed amount off, free shipping
- Coupon scope: entire cart, specific category (e.g. "Serums only"), specific product
- Constraints: min order value, max uses (global), max uses per customer, date range
- Auto-apply coupons vs. manual code entry
- Stackable flag (can combine with another coupon)
- Admin CRUD for coupons with usage analytics
- Apply coupon at cart/checkout step
- Show coupon savings on cart and order summary
- Bulk coupon code generation (CSV export)

---

### 5.8 Abandoned Cart Recovery

**Description:** Automatically recover revenue from carts left without checkout.

**Functional Requirements:**
- Track cart activity per authenticated user
- Define abandonment threshold: cart not checked out after X minutes (default: 30 min)
- Trigger 3-step email sequence:
  - Email 1 (1 hour after abandonment): "Your skincare picks are waiting" — reminder with cart contents
  - Email 2 (24 hours): Reminder + optional discount offer
  - Email 3 (72 hours): Final nudge with urgency ("Don't let your cart expire")
- Each email contains deep-link back to pre-populated cart
- Stop sequence if user completes purchase
- Admin dashboard: abandoned carts count, recovery rate, revenue recovered
- Unsubscribe from recovery emails (per user setting)

---

### 5.9 Personalized Recommendations

**Description:** Surface beauty products relevant to each user's skin type and concerns.

**Functional Requirements:**
- **Homepage:**
  - "Trending in Skincare" carousel (most purchased skincare in last 7 days)
  - "Trending in Makeup" carousel (separate, most purchased makeup in last 7 days)
  - "Build Your Routine" feature: curated set (Cleanser → Toner → Serum → Moisturiser → SPF)
- **Product page:**
  - "Complete your routine" — products from same brand/step that pair well
  - "Good for your skin type" — products matching the current user's `skin_type` profile
  - "Addresses the same concerns" — products with overlapping `concerns` array
- **Cart page:** "You might also like" (based on cart contents and skin type)
- **Post-purchase email:** "Recommended for your routine next" (based on order history and concerns)
- **Algorithm (v1):** Collaborative filtering using order co-occurrence + skincare attribute matching (SQL-based)
- **Algorithm (v2, post-launch):** Upgrade to vector embeddings via pgvector

---

### 5.10 Analytics & Reporting

**Description:** Self-hosted analytics dashboard for business intelligence.

**Admin Dashboard KPIs:**
- Total revenue (today / 7d / 30d / custom)
- Total orders (with status breakdown)
- Average Order Value (AOV)
- Conversion rate (sessions → purchases)
- Top-selling products (by revenue and by units)
- Revenue by category (Skincare vs. Makeup vs. Tools, etc.)
- Customer acquisition (new vs. returning)
- Abandoned cart rate and recovery rate
- Coupon usage and discount impact
- Inventory levels (low-stock alerts)
- Most-filtered skin types and concerns (helps with buying decisions)

**Reporting:**
- Date range picker for all reports
- Export any table to CSV
- Revenue trend line chart (daily/weekly/monthly)

**Data Sources:**
- All events stored in Supabase `analytics_events` table
- Server-side tracking (no reliance on client-side JS blockers)

---

### 5.11 SEO Optimization

**Description:** Built-in SEO best practices for beauty product discoverability.

**Functional Requirements:**
- Dynamic `<title>` and `<meta description>` per page via Next.js Metadata API
- Meta descriptions mention key ingredients, skin type, and concern (e.g. "Best Vitamin C serum for oily skin in Kenya")
- Open Graph and Twitter Card tags on all pages
- JSON-LD structured data:
  - `Product` schema with `ingredients` field and `additionalProperty` for skin type and concerns
  - `BreadcrumbList`, `Organization`, `WebSite`
  - `FAQPage` schema on category pages (common skincare questions)
- Auto-generated `sitemap.xml` (products, categories, pages) — regenerated on publish
- `robots.txt` with correct rules (block admin, allow product/category pages)
- Canonical URLs on all pages
- Semantic HTML (h1, h2, nav, main, article)
- Image alt text required field in admin product form
- Slug auto-generation from product/category name with manual override
- 301 redirects management (admin UI for slug changes)
- Core Web Vitals compliance (LCP, CLS, FID/INP)

---

### 5.12 SSL & Data Encryption

**Description:** Security-first architecture protecting customer and business data.

**Functional Requirements:**
- HTTPS enforced (TLS 1.2+) — handled by Vercel/host
- All API routes protected with Supabase Auth JWT validation
- Row-Level Security (RLS) enabled on all Supabase tables
- Customer passwords handled exclusively by Supabase Auth (bcrypt, never stored in plaintext)
- M-Pesa API secrets stored in environment variables only (never in code or DB)
- Payment callbacks verified via M-Pesa checksum validation
- PII (phone numbers, addresses) encrypted at rest using `pgcrypto`
- Admin routes protected by role-based middleware
- CORS policy: only allow requests from own domain
- Rate limiting on auth and checkout endpoints
- Supabase Vault for secrets management
- OWASP Top 10 reviewed at launch
- Input sanitization on all user-submitted content (DOMPurify on rich text)

---

### 5.13 User Skin Profile

**Description:** Optional skin profile stored on the customer account, powering personalized recommendations and filter defaults.

**Functional Requirements:**
- Skin type preference (single select): Oily, Dry, Combination, Sensitive, Normal
- Skin concerns (multi-select checkboxes): Acne, Anti-Aging, Hyperpigmentation, Hydration, Brightening, Dark Circles, Pores, Redness, Sensitivity
- Profile set during onboarding (optional step after register) or editable from `/account/skin-profile`
- Used to:
  - Pre-populate filter defaults on the product listing page
  - Power "Good for your skin type" recommendation carousels
  - Personalize email recommendations
- Stored in `profiles` table as `skin_type TEXT` and `skin_concerns TEXT[]`

---

## 6. Database Schema (High-Level)

```
users (extends Supabase auth.users)
profiles {
  id, full_name, phone, avatar_url, role,
  skin_type TEXT,           -- 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal'
  skin_concerns TEXT[]      -- ['acne','anti-aging','hyperpigmentation',...]
}
addresses { id, user_id, line1, line2, city, county, country, is_default }

categories {
  id, name, slug, parent_id, image_url,
  meta_title, meta_description, sort_order, is_active
}

products {
  id, name, slug, description, short_description,
  category_id, brand, price, sale_price, cost_price,
  sku, stock, low_stock_threshold, weight_kg,
  tags TEXT[],
  -- Skincare-specific fields --
  skin_type TEXT[],         -- ['oily','dry','combination','sensitive','all']
  concerns TEXT[],          -- ['acne','anti-aging','hyperpigmentation','hydration',...]
  ingredients TEXT,         -- full INCI ingredient list
  volume_ml NUMERIC,        -- product size in ml
  finish TEXT,              -- 'matte' | 'dewy' | 'satin' | 'glossy' | 'natural'
  shade TEXT,               -- shade name (e.g. "Warm Beige")
  shade_hex TEXT,           -- HEX color code for swatch rendering
  spf INT,                  -- SPF value for sunscreen products
  is_vegan BOOLEAN,
  is_cruelty_free BOOLEAN,
  is_natural BOOLEAN,
  -- Standard fields --
  is_published BOOLEAN, is_featured BOOLEAN,
  average_rating NUMERIC, review_count INT,
  meta_title, meta_description, search_vector TSVECTOR
}

product_variants { id, product_id, name, options jsonb, price_modifier, stock }
product_images { id, product_id, url, alt, sort_order, is_primary }

carts { id, user_id, session_id, abandoned_email_count, last_abandoned_email_at }
cart_items { id, cart_id, product_id, variant_id, quantity }

wishlists { id, user_id }
wishlist_items { id, wishlist_id, product_id, added_at }

orders {
  id, order_number, user_id, status, subtotal,
  discount_amount, shipping_amount, total,
  coupon_id, shipping_address jsonb, notes,
  checkout_request_id, mpesa_receipt, payment_phone
}
order_items { id, order_id, product_id, variant_id, product_name, product_image, variant_name, quantity, unit_price }
order_status_history { id, order_id, status, note, changed_by, changed_at }

payments { id, order_id, checkout_request_id, merchant_request_id, mpesa_receipt, phone, amount, status, result_code, result_desc }

reviews {
  id, product_id, user_id, order_id,
  rating, title, body,
  skin_type TEXT,           -- reviewer's skin type (optional context for shoppers)
  is_approved, helpful_count
}
review_votes { id, review_id, user_id }

coupons { id, code, type, value, min_order_value, max_uses, used_count, per_user_limit, product_id, category_id, is_stackable, is_active, starts_at, expires_at }

analytics_events { id, event_type, user_id, session_id, product_id, order_id, payload jsonb }
```

---

## 7. Product Categories

The platform carries **14 product categories** covering all aspects of skincare and cosmetics:

| # | Category | Slug | Description |
|---|----------|------|-------------|
| 1 | Moisturisers & Hydration | `moisturisers` | Day/night creams, hydrating lotions, face mists |
| 2 | Serums & Treatments | `serums-treatments` | Vitamin C, retinol, niacinamide, hyaluronic acid serums |
| 3 | Cleansers & Toners | `cleansers-toners` | Foaming cleansers, micellar water, AHA/BHA toners |
| 4 | Sunscreen & SPF | `sunscreen-spf` | SPF 30–50+ daily sunscreens, tinted sunscreen |
| 5 | Eye & Lip Care | `eye-lip-care` | Eye creams, lip balms, lip masks |
| 6 | Foundations & Concealer | `foundations-concealer` | Liquid/powder foundations, concealers |
| 7 | Blush, Bronzer & Highlighter | `blush-bronzer-highlighter` | Powder and cream blush, bronzers, highlighters |
| 8 | Lipstick & Lip Gloss | `lipstick-lip-gloss` | Matte/satin/glossy lips, lip liners |
| 9 | Mascaras & Eye Makeup | `mascaras-eye-makeup` | Mascaras, eyeliners, eyeshadow palettes |
| 10 | Nail Care | `nail-care` | Nail polishes, treatments, tools |
| 11 | Body & Bath | `body-bath` | Body lotions, scrubs, shower gels |
| 12 | Hair Care | `hair-care` | Shampoos, conditioners, hair oils, treatments |
| 13 | Tools & Accessories | `tools-accessories` | Facial rollers, gua sha, brushes, applicators |
| 14 | Natural & Organic | `natural-organic` | Clean beauty, natural formulations |

---

## 8. M-Pesa Integration

**API:** Safaricom Daraja API v2  
**Flow:** STK Push (Lipa Na M-Pesa Online)

1. Customer clicks "Pay with M-Pesa" and enters their phone number
2. Backend calls `stkpush/v1/processrequest` with amount, phone, callback URL
3. Customer receives STK prompt on their phone and enters PIN
4. Safaricom calls our callback URL with result
5. Backend verifies `CheckoutRequestID` and `ResultCode = 0`
6. Order status updated to `Payment Confirmed`
7. Confirmation email sent to customer: "Your beauty essentials are on their way"

**Security:** Callback URL must be HTTPS. Validate `CheckoutRequestID` matches stored value before confirming order.

---

## 9. Email Copy & Tone

All transactional emails use beauty/skincare-specific copy:

| Email | Subject Line | Tone |
|-------|-------------|------|
| Welcome | "Start your skincare journey with Anashe ✨" | Warm, aspirational |
| Order Confirmation | "Order #XXXX confirmed — your beauty essentials are on their way" | Reassuring, excited |
| Abandoned Cart (1hr) | "Your skincare picks are waiting 🌿" | Friendly nudge |
| Abandoned Cart (24hr) | "Don't forget your routine essentials" | Gentle urgency |
| Abandoned Cart (72hr) | "Last chance — your cart expires soon" | Urgency |
| Order Status Update | "Your Anashe order is [status]" | Informative |
| Wishlist Sale Alert | "A product on your wishlist just went on sale! 💛" | Exciting |
| Post-purchase rec | "Complete your skincare routine" | Helpful, personal |

---

## 10. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Availability | 99.9% uptime |
| API Response Time (p95) | < 500ms |
| Page Load (mobile, 4G) | FCP < 1.5s |
| Max Concurrent Users | 500 (v1) |
| DB Backup | Supabase daily automatic backups |
| Session Timeout | 7 days (rolling) |
| Image Optimization | Next.js `<Image>` with WebP conversion |

---

## 11. Out of Scope (v1)

- Multi-vendor / marketplace features
- Card payments (Visa/Mastercard)
- Native mobile app (iOS/Android)
- Multi-language / multi-currency
- Physical POS integration
- Subscription products (beauty boxes)
- Live chat support widget
- B2B/wholesale pricing
- AR try-on (virtual shade matching)

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| M-Pesa API downtime | Queue payments; show clear error with retry; fallback message |
| M-Pesa callback failures | Idempotent callbacks; polling endpoint as backup |
| Data breach | RLS + encryption + security audit before launch |
| Supabase free tier limits | Estimate usage; upgrade plan pre-launch |
| SEO cannibalization from faceted search | Canonical URLs + noindex on filtered pages |
| Shade swatch inaccuracy | Display disclaimer: "Shades may vary on screen" |

---

## 13. Launch Checklist

- [ ] Supabase RLS policies audited
- [ ] M-Pesa Daraja production credentials configured
- [ ] All 8 transactional emails tested with real addresses
- [ ] SSL certificate active
- [ ] `robots.txt` and `sitemap.xml` verified in Google Search Console
- [ ] Payment flow end-to-end tested with real phone number
- [ ] Load test: 100 concurrent users
- [ ] Admin account created; default password changed
- [ ] Seed data: 40–50 skincare & cosmetic products loaded
- [ ] At least 8 makeup products with shade/shade_hex values populated
- [ ] GDPR-style Privacy Policy and Terms pages live
- [ ] Backup restore tested
- [ ] Ingredient list highlights tested for known irritants
- [ ] Skin profile onboarding flow tested on mobile
