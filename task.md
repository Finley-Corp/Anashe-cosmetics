# Anashe E-Commerce — Task List for AI Agent
## Skincare & Cosmetics Vertical

**Format:** Each task has a unique ID, phase, clear acceptance criteria, and implementation notes.  
**Agent Instructions:** Work tasks in order within each phase. Mark a task `[x]` only when ALL acceptance criteria pass. Never skip tasks.  
**Vertical:** This is an exclusively skincare and cosmetic products store. All data, UI, copy, and filters must reflect this vertical.

---

## PHASE 0 — Project Setup

### TASK-001: Initialize Next.js Project
**Status:** `[ ]`  
**Priority:** P0

**Steps:**
```bash
npx create-next-app@latest anashe \
  --typescript --tailwind --app --src-dir=false \
  --import-alias="@/*" --eslint
cd anashe
```

**Install core dependencies:**
```bash
npm install @supabase/supabase-js @supabase/ssr \
  zod react-hook-form @hookform/resolvers \
  zustand resend @react-email/components \
  lucide-react recharts slugify date-fns \
  isomorphic-dompurify
```

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] TypeScript strict mode enabled in `tsconfig.json`
- [ ] TailwindCSS applied (test with a colored div)
- [ ] No unused template files remain

---

### TASK-002: Configure Supabase
**Status:** `[ ]`  
**Priority:** P0

**Steps:**
1. Create Supabase project at supabase.com
2. Copy URL and publishable key to `.env.local`
3. Create `lib/supabase/client.ts` (browser client)
4. Create `lib/supabase/server.ts` (server client using `createServerClient`)
5. Create `middleware.ts` to refresh session on every request

**`lib/supabase/client.ts`:**
```typescript
import { createBrowserClient } from '@supabase/ssr'
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
         ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
```

**`middleware.ts`:**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Refresh session; protect /admin and /account routes
  // Redirect unauthenticated users to /auth/login
  // Redirect non-admin users away from /admin
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

**Acceptance Criteria:**
- [ ] Supabase client initializes without errors
- [ ] Session refresh works across page navigation
- [ ] `/account/*` redirects to login when unauthenticated
- [ ] `/admin/*` returns redirect for non-admin users

---

### TASK-003: Initialize shadcn/ui
**Status:** `[ ]`  
**Priority:** P0

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card badge
npx shadcn-ui@latest add dialog drawer sheet toast
npx shadcn-ui@latest add select checkbox radio-group
npx shadcn-ui@latest add table pagination skeleton
npx shadcn-ui@latest add accordion tabs
```

**Acceptance Criteria:**
- [ ] `components/ui/` directory created
- [ ] All added components render without console errors
- [ ] Accordion component available (used for ingredients list)

---

### TASK-004: Configure Brand Theme
**Status:** `[ ]`  
**Priority:** P0

Add Anashe brand colors to `tailwind.config.ts`:
```typescript
// Primary: deep green (nature, clean beauty)
// Accent: warm gold (premium, Kenyan warmth)
colors: {
  primary: { 50:'#f0fdf4', 100:'#dcfce7', 500:'#22c55e', 600:'#16a34a', 700:'#15803d', 900:'#14532d' },
  accent:  { 400:'#fbbf24', 500:'#f59e0b', 600:'#d97706' },
}
```

Also configure `globals.css` with:
- CSS custom properties for brand colors
- Skeleton shimmer animation
- Reveal scroll animation
- Glassmorphism utility class
- Custom scrollbar

**Acceptance Criteria:**
- [ ] Brand colors applied to CSS variables
- [ ] Primary button uses brand color
- [ ] Inter + Crimson Pro fonts loaded via `next/font/google`
- [ ] Reveal animation class works on scroll

---

## PHASE 1 — Database Schema

### TASK-005: Write Initial Migration
**Status:** `[ ]`  
**Priority:** P0

Create `supabase/migrations/001_initial_schema.sql`.

Key difference from a generic store: the `products` table includes skincare/cosmetic-specific columns, and `profiles` includes skin profile fields.

**Full schema:**

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles (extends auth.users) — includes skin profile
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  skin_type TEXT CHECK (skin_type IN ('oily','dry','combination','sensitive','normal')),
  skin_concerns TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  county TEXT,
  country TEXT NOT NULL DEFAULT 'Kenya',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (14 skincare/cosmetic categories)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  description TEXT,
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products — skincare/cosmetic specific columns included
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES categories(id),
  price NUMERIC(10,2) NOT NULL,
  sale_price NUMERIC(10,2),
  cost_price NUMERIC(10,2),
  sku TEXT UNIQUE,
  stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  weight_kg NUMERIC(5,2),
  brand TEXT,

  -- Skincare-specific columns
  skin_type TEXT[] DEFAULT '{}',         -- e.g. ARRAY['oily','combination']
  concerns TEXT[] DEFAULT '{}',          -- e.g. ARRAY['acne','hyperpigmentation']
  ingredients TEXT,                       -- full INCI ingredient list
  volume_ml NUMERIC(6,1),                -- product size e.g. 30.0, 50.0, 100.0
  finish TEXT CHECK (finish IN ('matte','dewy','satin','glossy','natural')),
  shade TEXT,                             -- shade name for color cosmetics
  shade_hex TEXT,                         -- HEX color code for swatch rendering
  spf INT,                                -- SPF value, NULL for non-SPF products
  is_vegan BOOLEAN DEFAULT FALSE,
  is_cruelty_free BOOLEAN DEFAULT FALSE,
  is_natural BOOLEAN DEFAULT FALSE,

  -- Standard product fields
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  average_rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE
);

-- Product variants (e.g. different sizes of the same serum)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '{}',
  price_modifier NUMERIC(10,2) DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carts
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  abandoned_email_count INT DEFAULT 0,
  last_abandoned_email_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  variant_id UUID REFERENCES product_variants(id),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wishlist_id, product_id)
);

-- Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  product_id UUID REFERENCES products(id),
  category_id UUID REFERENCES categories(id),
  is_stackable BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment','payment_confirmed','processing','shipped','delivered','cancelled','refunded')),
  subtotal NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  shipping_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  coupon_id UUID REFERENCES coupons(id),
  shipping_address JSONB NOT NULL,
  notes TEXT,
  checkout_request_id TEXT,
  mpesa_receipt TEXT,
  payment_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  variant_id UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_name TEXT,
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

-- Order status history
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  checkout_request_id TEXT UNIQUE NOT NULL,
  merchant_request_id TEXT,
  mpesa_receipt TEXT,
  phone TEXT,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','success','failed','timeout')),
  result_code INT,
  result_desc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews — includes reviewer skin type for context
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  skin_type TEXT,             -- reviewer's skin type (adds context for other shoppers)
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id, order_id)
);

CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  UNIQUE(review_id, user_id)
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  product_id UUID REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_skin_type ON products USING GIN(skin_type);
CREATE INDEX idx_products_concerns ON products USING GIN(concerns);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_spf ON products(spf) WHERE spf IS NOT NULL;
CREATE INDEX idx_products_finish ON products(finish) WHERE finish IS NOT NULL;
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at);

-- Search vector trigger (includes ingredients and concerns in search index)
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.concerns, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.skin_type, ' '), '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.ingredients, '')), 'D') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_vector_trigger
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Auto-update average_rating on products
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    average_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Auto-create profile + wishlist on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'customer');
  INSERT INTO wishlists (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Acceptance Criteria:**
- [ ] Migration runs without SQL errors
- [ ] All 20+ tables exist in Supabase Studio
- [ ] `products` table has `skin_type`, `concerns`, `ingredients`, `volume_ml`, `finish`, `shade`, `shade_hex`, `spf`, `is_vegan`, `is_cruelty_free`, `is_natural` columns
- [ ] `profiles` table has `skin_type` and `skin_concerns` columns
- [ ] `reviews` table has `skin_type` column
- [ ] Search vector trigger fires on product insert
- [ ] GIN indexes on `skin_type` and `concerns` arrays created
- [ ] Rating trigger updates product on review insert

---

### TASK-006: Write RLS Policies
**Status:** `[ ]`  
**Priority:** P0

Create `supabase/migrations/002_rls_policies.sql`:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Products and categories: public read, admin write
CREATE POLICY "Products: public read published" ON products
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Products: admin full access" ON products
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Categories: public read active" ON categories
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Categories: admin full access" ON categories
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Product images: public read" ON product_images
  FOR SELECT USING (TRUE);
CREATE POLICY "Product variants: public read" ON product_variants
  FOR SELECT USING (TRUE);

-- Profiles: users read/update own
CREATE POLICY "Profiles: own profile" ON profiles
  USING (auth.uid() = id);

-- Orders: users see own orders
CREATE POLICY "Orders: own orders" ON orders
  USING (auth.uid() = user_id);
CREATE POLICY "Orders: admin full access" ON orders
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Order items: own order items" ON order_items
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Cart: users see own cart
CREATE POLICY "Cart: own cart" ON carts
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', TRUE));

CREATE POLICY "Cart items: own cart items" ON cart_items
  USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));

-- Wishlist: users see own
CREATE POLICY "Wishlist: own wishlist" ON wishlists
  USING (auth.uid() = user_id);
CREATE POLICY "Wishlist items: own items" ON wishlist_items
  USING (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));

-- Reviews: public read approved; users manage own
CREATE POLICY "Reviews: public read approved" ON reviews
  FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Reviews: own reviews" ON reviews
  USING (auth.uid() = user_id);
CREATE POLICY "Reviews: admin full access" ON reviews
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Review votes: own votes" ON review_votes
  USING (auth.uid() = user_id);
```

**Acceptance Criteria:**
- [ ] Guest cannot read unapproved reviews
- [ ] User cannot read other user's orders
- [ ] Admin can read all orders
- [ ] Admin can insert/update/delete products
- [ ] Verify with Supabase Policy Editor tests

---

### TASK-007: Seed Database with Skincare Products
**Status:** `[ ]`  
**Priority:** P1

Create `supabase/seed.sql` with:

**Categories (14):**
Insert all 14 skincare/cosmetic categories defined in the PRD:
- Moisturisers & Hydration (`moisturisers`)
- Serums & Treatments (`serums-treatments`)
- Cleansers & Toners (`cleansers-toners`)
- Sunscreen & SPF (`sunscreen-spf`)
- Eye & Lip Care (`eye-lip-care`)
- Foundations & Concealer (`foundations-concealer`)
- Blush, Bronzer & Highlighter (`blush-bronzer-highlighter`)
- Lipstick & Lip Gloss (`lipstick-lip-gloss`)
- Mascaras & Eye Makeup (`mascaras-eye-makeup`)
- Nail Care (`nail-care`)
- Body & Bath (`body-bath`)
- Hair Care (`hair-care`)
- Tools & Accessories (`tools-accessories`)
- Natural & Organic (`natural-organic`)

**Products (40–50 realistic skincare & cosmetic products):**

All products must have:
- Kenyan pricing: KES 500 – KES 8,000
- `skin_type` array populated
- `concerns` array populated
- `ingredients` field populated (realistic INCI names)
- `volume_ml` populated
- `is_published = TRUE`

Sample product rows to include (write full INSERT statements for all):

```sql
-- SKINCARE products (30+)
-- Vitamin C Brightening Serum 30ml — KES 2,800
-- Hyaluronic Acid Hydrating Serum 30ml — KES 1,900
-- Retinol Night Repair Serum 30ml — KES 3,200
-- Niacinamide 10% + Zinc 1% Serum 30ml — KES 1,500
-- AHA/BHA Exfoliating Toner 200ml — KES 2,100
-- Gentle Foaming Cleanser 150ml — KES 950
-- Micellar Cleansing Water 250ml — KES 1,200
-- SPF 50+ Daily Moisturising Sunscreen 50ml — KES 1,800 (spf=50)
-- Tinted SPF 30 BB Cream 40ml — KES 1,600 (spf=30)
-- Hydrating Day Cream SPF 20 50ml — KES 1,400 (spf=20)
-- Deep Moisture Night Cream 50ml — KES 2,200
-- Oil-Free Gel Moisturiser 60ml — KES 1,350
-- Rich Shea Butter Moisturiser 100ml — KES 900
-- Eye Contour Cream 15ml — KES 2,500
-- Under Eye Brightening Gel 20ml — KES 1,750
-- Hydrating Lip Mask 15ml — KES 650
-- Ceramide Barrier Repair Serum 30ml — KES 3,500
-- Rosehip Facial Oil 30ml — KES 1,950 (is_natural=TRUE)
-- Green Tea Antioxidant Face Mist 100ml — KES 850
-- Salicylic Acid Spot Treatment 30ml — KES 1,100
-- Collagen Boosting Neck Cream 75ml — KES 2,800
-- Body Glow Lotion SPF 15 250ml — KES 1,200 (spf=15)
-- Shea & Cocoa Butter Body Cream 300ml — KES 800
-- Coffee Body Scrub 200g — KES 750 (is_natural=TRUE)
-- Brightening Body Serum 150ml — KES 1,650
-- Tea Tree & Aloe Vera Gel 100ml — KES 700 (is_natural=TRUE, is_vegan=TRUE)
-- Argan Oil Hair Treatment 100ml — KES 1,300
-- Scalp Strengthening Shampoo 250ml — KES 950
-- Keratin Repair Conditioner 250ml — KES 1,050
-- Rose Quartz Facial Roller — KES 1,800 (tools)
-- Gua Sha Jade Stone — KES 1,500 (tools)
-- Silicone Cleansing Brush — KES 1,200 (tools)
-- Bamboo Makeup Brush Set (12pc) — KES 2,200 (tools, is_natural=TRUE)

-- MAKEUP products (8+ with shade + shade_hex)
-- Skin Glow Liquid Foundation 30ml
--   shades: Porcelain (#F5E6D3), Warm Ivory (#EEDAD4), Sand (#DBC5A0),
--           Natural Beige (#C4956A), Warm Caramel (#A0714F), Espresso (#6B3E2E)
-- Full Coverage Concealer 6ml
--   shades: Fair (#F2E0CA), Light (#E5C9A8), Medium (#C49A6C), Tan (#A0714F), Deep (#6B3E2E)
-- Powder Blush — Coral Kiss (finish=matte, shade_hex=#E8725A)
-- Powder Blush — Berry Rose (finish=matte, shade_hex=#C4536A)
-- Bronzer — Sun Kissed (shade_hex=#C4956A)
-- Highlighter — Golden Hour (finish=glossy, shade_hex=#F5D78E)
-- Matte Lipstick — Classic Red (shade_hex=#C0392B)
-- Matte Lipstick — Nude Mauve (shade_hex=#C4956A)
-- Matte Lipstick — Berry Plum (shade_hex=#7D3C98)
-- Satin Lip Gloss — Rose Gold (finish=glossy, shade_hex=#E8B4B8)
-- Black Volumising Mascara — KES 950
-- Brown Defining Eyeliner — KES 600
-- Nude Eyeshadow Palette 9-pan — KES 2,500
-- Nail Polish — Coral Crush (shade_hex=#FF6B6B) — KES 450
-- Nail Polish — Nude Blush (shade_hex=#E8B4B8) — KES 450
-- Nail Polish — Classic Red (shade_hex=#C0392B) — KES 450
```

**Skin types and concerns to assign per product:**

- Cleansers & toners: all skin types or specific (oily, combination)
- Serums: target specific concerns (acne → salicylic acid; anti-aging → retinol; brightening → vitamin C)
- Moisturisers: target dry, sensitive, combination
- Sunscreen: all skin types
- Makeup: all skin types (with shade_hex for color products)
- Body & Bath: all skin types
- Tools: N/A for skin_type (use `'{}'`)

**Coupons (3):**
```sql
-- WELCOME10: 10% off, no min order
-- GLOW200: KES 200 off, min order KES 1,500
-- FREESHIP: free shipping, min order KES 1,000
```

**Acceptance Criteria:**
- [ ] Seed runs without errors
- [ ] 14 categories created in correct order
- [ ] At least 40 products created
- [ ] All skincare products have `skin_type`, `concerns`, `ingredients`, `volume_ml` populated
- [ ] At least 8 makeup products have `shade` and `shade_hex` populated
- [ ] At least 3 products are Vegan + Cruelty-Free
- [ ] At least 4 sunscreen products have `spf` value set
- [ ] Search vectors populated on all products (test: `SELECT name FROM products WHERE search_vector @@ to_tsquery('english', 'vitamin')`)

---

## PHASE 2 — Product Catalog

### TASK-008: Product Listing Page with Skincare Filters
**Status:** `[ ]`  
**Priority:** P1

**File:** `app/(storefront)/products/page.tsx`

**Filter params to support:**
- `q` — full-text search (searches name, brand, concerns, ingredients)
- `category` — category slug
- `skin_type[]` — multi-value: `?skin_type[]=oily&skin_type[]=combination`
- `concerns[]` — multi-value: `?concerns[]=acne&concerns[]=brightening`
- `finish` — for makeup: `?finish=matte`
- `spf_min` / `spf_max` — for sunscreen: `?spf_min=30&spf_max=50`
- `is_vegan` / `is_cruelty_free` / `is_natural` — certification flags
- `min_price` / `max_price` — price range
- `sort` — `relevance | price_asc | price_desc | newest | rating`
- `page` — pagination

**`ProductFilters` sidebar must include (in order):**
1. Skin Type (multi-select checkboxes): All, Oily, Dry, Combination, Sensitive
2. Skin Concern (multi-select checkboxes): Acne, Anti-Aging, Hyperpigmentation, Hydration, Brightening, Dark Circles, Pores, Redness
3. Finish (radio, shown only for makeup categories): All, Matte, Dewy, Satin, Glossy
4. SPF (range slider, shown only for sunscreen category): 0 – 50
5. Certifications (checkboxes): Vegan, Cruelty-Free, Natural/Organic
6. Price Range (KES range slider)
7. Availability (In Stock Only)

**SQL for filters:**
```sql
-- Skin type overlap filter
AND products.skin_type && ARRAY['oily','combination']::TEXT[]

-- Concerns overlap filter
AND products.concerns && ARRAY['acne']::TEXT[]

-- SPF range
AND products.spf BETWEEN 30 AND 50

-- Certifications
AND products.is_vegan = TRUE
AND products.is_cruelty_free = TRUE
```

**Acceptance Criteria:**
- [ ] Products render in responsive grid (1→2→3→4 columns)
- [ ] Skin type filter returns only products matching that skin type
- [ ] Concern filter returns only matching products
- [ ] Certification filter (vegan, cruelty-free) works
- [ ] SPF filter works on sunscreen products
- [ ] Search by ingredient name returns relevant results (e.g. search "niacinamide")
- [ ] URL reflects all active filters (shareable URLs)
- [ ] Empty state shown when no results match
- [ ] Pagination works (12 products per page)
- [ ] Loading state with skeleton cards

---

### TASK-009: Product Detail Page — Skincare UI
**Status:** `[ ]`  
**Priority:** P1

**File:** `app/(storefront)/products/[slug]/page.tsx`

Implement with `generateStaticParams` + ISR (revalidate: 60).

**Required skincare UI sections (in order on page):**

1. **Image gallery** — main image + thumbnail strip + zoom
2. **Brand + name + rating**
3. **Price** — sale price + original (strikethrough) + discount %
4. **Volume badge** — "30ml" pill (if `volume_ml` set)
5. **SPF badge** — "SPF 50+" prominent green badge (if `spf` set)
6. **Stock badge** — In Stock / Low Stock (X left) / Out of Stock
7. **Skin Type Badges** — pill row: e.g. "Oily · Combination · Sensitive"
   - Only show if `skin_type` array is non-empty
8. **Concerns Tags** — tag row: "Acne", "Anti-Aging", "Brightening"
   - Only show if `concerns` array is non-empty
9. **Certification Badges** — row of icons:
   - 🌿 Vegan (if `is_vegan`)
   - 🐰 Cruelty-Free (if `is_cruelty_free`)
   - 🌱 Natural (if `is_natural`)
10. **Shade Selector** — circular swatch grid (if `shade_hex` is set on product or variants)
    - Render each swatch as a circle filled with `shade_hex` color
    - Selected shade has a ring outline
    - Shade name shown below selected swatch
11. **Variant selector** — size/volume variants (updates price + stock)
12. **Quantity selector** — with stock validation
13. **Add to Cart + Add to Wishlist CTAs**
14. **Short description**
15. **"How to Use" accordion** — application instructions (from product description / a separate field)
16. **Full Ingredient List accordion** — collapsible
    - Display full `ingredients` text (INCI format)
    - Highlight known irritants in amber: Fragrance, Alcohol Denat., Parabens, Sulfates, Formaldehyde
    - Add disclaimer: "Ingredient list may vary by batch. Always patch test."
17. **Product specifications table** (volume, finish, SPF, brand, SKU)
18. **Reviews section** (aggregate + list + form — see TASK-013)
19. **"Complete Your Routine" carousel** — related products from same brand or complementary categories
20. **"Good for Your Skin Type" carousel** — if user has skin profile set, show products matching their skin type

**JSON-LD for product page:**
```typescript
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: product.images.map(i => i.url),
  description: product.short_description,
  sku: product.sku,
  brand: { '@type': 'Brand', name: product.brand },
  material: product.ingredients,  // ingredient list
  additionalProperty: [
    ...(product.skin_type?.length ? [{
      '@type': 'PropertyValue',
      name: 'Skin Type',
      value: product.skin_type.join(', ')
    }] : []),
    ...(product.concerns?.length ? [{
      '@type': 'PropertyValue',
      name: 'Skin Concern',
      value: product.concerns.join(', ')
    }] : []),
    ...(product.volume_ml ? [{
      '@type': 'PropertyValue',
      name: 'Volume',
      value: `${product.volume_ml}ml`
    }] : []),
    ...(product.spf ? [{
      '@type': 'PropertyValue',
      name: 'SPF',
      value: String(product.spf)
    }] : []),
  ],
  offers: {
    '@type': 'Offer',
    price: product.sale_price ?? product.price,
    priceCurrency: 'KES',
    availability: product.stock > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
  aggregateRating: product.review_count > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: product.average_rating,
    reviewCount: product.review_count,
  } : undefined,
};
```

**`generateMetadata` — mention skin type and key ingredient:**
```typescript
// Example output:
// title: "Vitamin C Brightening Serum 30ml | Anashe"
// description: "Shop Vitamin C Brightening Serum 30ml by The Ordinary. Best for oily and combination skin. Targets hyperpigmentation and brightening. With 15% L-ascorbic acid. KES 2,800 — Pay via M-Pesa in Kenya."
```

**Acceptance Criteria:**
- [ ] Skin type badges render for all skincare products
- [ ] Concern tags render for all skincare products
- [ ] Certification badges (vegan/CF/natural) show only when flags are true
- [ ] Shade selector renders color circles using `shade_hex` (test with a lipstick product)
- [ ] Ingredient list accordion is collapsed by default, expands on click
- [ ] Known irritants (Fragrance, Alcohol Denat., Parabens) highlighted in amber within ingredient list
- [ ] SPF badge shows for sunscreen products, hidden for others
- [ ] JSON-LD validates in Google Rich Results Test
- [ ] `generateMetadata` includes skin type and key ingredient in description
- [ ] Page is SSR (view-source shows product content)
- [ ] Out-of-stock product disables Add to Cart button

---

### TASK-010: Search Autocomplete
**Status:** `[ ]`  
**Priority:** P2

**File:** `components/storefront/SearchBar.tsx`

- Input with 300ms debounce
- `GET /api/search/suggestions?q=...` returns 5 suggestions
- Results include ingredient/concern matches (e.g. typing "niacinamide" returns serum products)
- Keyboard navigation (arrow keys, enter, escape)
- Show product image + name + price + skin type mini-badges in dropdown
- Navigate to `/products?q=...` on submit

**SQL:**
```sql
SELECT id, name, slug, price, sale_price, skin_type,
  (SELECT url FROM product_images WHERE product_id = products.id AND is_primary = TRUE LIMIT 1) as image
FROM products
WHERE is_published = TRUE
  AND (
    name ILIKE $1
    OR brand ILIKE $1
    OR ingredients ILIKE $1
    OR concerns @> ARRAY[$2]::TEXT[]
  )
LIMIT 5;
```

**Acceptance Criteria:**
- [ ] Autocomplete appears after 2+ characters
- [ ] Searching ingredient name (e.g. "retinol") returns relevant products
- [ ] Searching concern (e.g. "acne") returns products targeting acne
- [ ] Skin type mini-badges show in dropdown result
- [ ] Keyboard navigation works

---

### TASK-011: Category Pages
**Status:** `[ ]`  
**Priority:** P2

**File:** `app/(storefront)/categories/[slug]/page.tsx`

- Fetch category by slug, validate exists or 404
- Show category banner image + name + description
- Show all skincare-relevant subcategories (if parent category)
- Render `ProductGrid` with category filter pre-applied
- Include all skincare filters from TASK-008
- Include `FAQPage` JSON-LD with skincare questions per category

**FAQ JSON-LD per category:**
```typescript
// For /categories/serums-treatments:
const faqs = [
  { q: "What is a face serum?", a: "A serum is a lightweight skincare product with highly concentrated active ingredients..." },
  { q: "How do I layer serums?", a: "Apply thinner serums first, then thicker. Allow each to absorb for 30-60 seconds..." },
  { q: "Which serum is best for oily skin in Kenya?", a: "Niacinamide and salicylic acid serums work best for oily skin..." },
];

// For /categories/sunscreen-spf:
const faqs = [
  { q: "What SPF should I use daily in Kenya?", a: "Due to Kenya's proximity to the equator, SPF 50+ is recommended for daily use..." },
  { q: "Is sunscreen necessary indoors?", a: "UVA rays penetrate windows, so sunscreen is advised even indoors..." },
  { q: "Can I use SPF instead of a moisturiser?", a: "Some SPF products contain hydrating ingredients, but a separate moisturiser is usually recommended..." },
];
```

**Acceptance Criteria:**
- [ ] Category pages render correct products
- [ ] Skincare filters work within category pages
- [ ] Non-existent slug returns 404
- [ ] FAQ JSON-LD included for serums and sunscreen categories
- [ ] FAQs validate in Google Rich Results Test

---

### TASK-012: Homepage — Beauty Vertical
**Status:** `[ ]`  
**Priority:** P1

**File:** `app/(storefront)/home/page.tsx`

**Required sections (in order):**

1. **Hero banner** — Full-width, clean minimal aesthetic
   - Headline: "Your skincare routine, delivered."
   - Subline: "Discover premium skincare and cosmetics, curated for Kenyan skin."
   - CTA: "Shop Now" → `/products`
   - CTA 2: "Build Your Routine" → `/products?category=serums-treatments`

2. **Trust bar** — 4 icons: 🌿 Authentic Products · 🇰🇪 Kenyan Market Pricing · 📦 Fast Delivery · 💚 M-Pesa Payments

3. **Shop by Concern** — 4 concern tiles in a grid:
   - Acne & Blemishes → `/products?concerns[]=acne`
   - Anti-Aging → `/products?concerns[]=anti-aging`
   - Hydration → `/products?concerns[]=hydration`
   - Brightening → `/products?concerns[]=brightening`

4. **Shop by Skin Type** — 4 skin type tiles (icon + label):
   - Oily → `/products?skin_type[]=oily`
   - Dry → `/products?skin_type[]=dry`
   - Combination → `/products?skin_type[]=combination`
   - Sensitive → `/products?skin_type[]=sensitive`

5. **"Build Your Routine" stepper** — horizontal step flow (mobile: vertical scroll):
   - Step 1: Cleanser → `/categories/cleansers-toners`
   - Step 2: Toner → `/categories/cleansers-toners`
   - Step 3: Serum → `/categories/serums-treatments`
   - Step 4: Moisturiser → `/categories/moisturisers`
   - Step 5: SPF → `/categories/sunscreen-spf`
   - Each step has an icon, label, and "Shop" link

6. **Trending in Skincare** — horizontal product carousel (8 products, `category ≠ makeup`, `order_items` co-occurrence last 7 days)

7. **Trending in Makeup** — horizontal product carousel (8 products, makeup categories only)

8. **New Arrivals** — latest 8 published products (by `created_at DESC`)

9. **"As Seen in Kenya" / Social proof section** — static stats or review highlights:
   - "500+ happy customers"
   - "100% authentic products"
   - Featured review quote

10. **Newsletter signup** — email input + "Join our Beauty Community" CTA
    - Subline: "Get skincare tips, new arrivals, and exclusive offers."

**Acceptance Criteria:**
- [ ] All 10 sections render
- [ ] "Shop by Concern" tiles link to correctly filtered product listing
- [ ] "Shop by Skin Type" tiles link to correctly filtered product listing
- [ ] "Build Your Routine" stepper renders with 5 steps and correct links
- [ ] "Trending in Skincare" carousel shows skincare (non-makeup) products only
- [ ] "Trending in Makeup" carousel shows makeup category products only
- [ ] Hero CTA navigates to /products
- [ ] Page loads < 2s

---

### TASK-013: Product Reviews with Skin Type Context
**Status:** `[ ]`  
**Priority:** P2

**Components:** `ReviewSection.tsx`, `ReviewForm.tsx`, `StarRating.tsx`

- Display aggregate rating (stars + total count)
- List of approved reviews, paginated (5 per page)
- Each review displays: stars, title, body, reviewer name, **skin type badge** (if reviewer provided it), date
- Sort: newest / highest / lowest / most helpful
- `ReviewForm` — only shown if user purchased product and hasn't reviewed yet
  - Fields: Rating (stars), Title, Body, Your Skin Type (optional select: Oily / Dry / Combination / Sensitive)
  - Skin type field helps other shoppers assess relevance of the review
- "Was this helpful?" vote button

**Acceptance Criteria:**
- [ ] Reviewer skin type badge shows on each review that has one
- [ ] Unauthenticated users see reviews but no form
- [ ] User who bought product sees review form with skin type field
- [ ] Submitted review appears in admin moderation queue
- [ ] Helpful vote increments count

---

## PHASE 3 — Cart & Wishlist

### TASK-014: Cart State Management
**Status:** `[ ]`  
**Priority:** P0

**File:** `store/cart.ts` (Zustand)

- State: `{ items, isOpen, getItemCount(), getSubtotal() }`
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `openCart`, `closeCart`, `toggleCart`
- Persist to `localStorage`
- On auth: merge localStorage guest cart with server cart
- Optimistic updates with rollback on error

**Acceptance Criteria:**
- [ ] Add to cart works (with shade/variant)
- [ ] Cart persists across page refresh
- [ ] Guest cart items survive login (merged)
- [ ] Quantity validation respects stock limit
- [ ] Cart total calculated correctly

---

### TASK-015: Cart Drawer UI
**Status:** `[ ]`  
**Priority:** P1

**File:** `components/storefront/CartDrawer.tsx`

- Slide-in drawer from right
- List cart items: image, name, shade (if applicable), quantity stepper, price, remove button
- Subtotal + item count
- "View Cart" and "Checkout" CTAs
- Empty cart state with "Continue Shopping" link

**Acceptance Criteria:**
- [ ] Drawer opens on cart icon click
- [ ] Items render with image, name, and shade name (if color cosmetic)
- [ ] Quantity stepper updates cart
- [ ] Checkout button navigates to /checkout

---

### TASK-016: Wishlist
**Status:** `[ ]`  
**Priority:** P2

**Files:** `app/(storefront)/wishlist/page.tsx`

- Heart icon on `ProductCard` toggles wishlist (optimistic UI)
- Requires login (redirect if not authenticated)
- `/wishlist` page shows all saved items with skin type badges and shade
- "Move to Cart" button, "Remove" button

**Acceptance Criteria:**
- [ ] Heart icon fills/unfills correctly
- [ ] Wishlist persists after page refresh
- [ ] Wishlisted product shows shade name if it's a color cosmetic
- [ ] "Move to Cart" adds item and removes from wishlist

---

## PHASE 4 — M-Pesa Checkout

### TASK-017: Checkout Page UI
**Status:** `[ ]`  
**Priority:** P0

**File:** `app/(storefront)/checkout/page.tsx`

Multi-step checkout:

**Step 1 — Contact & Delivery:**
- Logged-in user: show saved addresses + "Add new address" option
- Guest: redirect to login/register
- Address form with Zod validation

**Step 2 — Order Review:**
- Cart items summary (product image, name, shade if applicable, quantity, price)
- Coupon code input + apply button
- Price breakdown: subtotal, discount, shipping (free default), total

**Step 3 — Payment:**
- "Pay with M-Pesa" section with M-Pesa logo
- Phone number input (pre-fill from profile)
- Format: 07XXXXXXXX → 2547XXXXXXXX
- "Place Order & Pay KES X,XXX" button

**Step 4 — Waiting:**
- Spinner with "Check your phone" + M-Pesa icon
- "We've sent a payment request to [phone]"
- Poll `/api/orders/[id]/status` every 3s

**Step 5 — Success:**
- Order number + M-Pesa receipt displayed
- "Your beauty essentials are on their way! 🌿"
- "Continue Shopping" CTA

**Acceptance Criteria:**
- [ ] Empty cart redirects to /cart
- [ ] Address validation works
- [ ] Coupon validation rejects expired/invalid codes
- [ ] Shade name shows in order review for color cosmetics
- [ ] Phone number formatted correctly before STK push
- [ ] Success page shows M-Pesa receipt number

---

### TASK-018: M-Pesa STK Push Integration
**Status:** `[ ]`  
**Priority:** P0

**Files:** `lib/mpesa/auth.ts`, `lib/mpesa/stk-push.ts`, `app/api/mpesa/stk-push/route.ts`

STK push uses production endpoint when `MPESA_ENV=production`:
```typescript
const MPESA_BASE_URL = process.env.MPESA_ENV === 'sandbox'
  ? 'https://sandbox.safaricom.co.ke'
  : 'https://api.safaricom.co.ke';
```

Transaction description: `'Anashe Beauty Order'`
Account reference: `'ANASHE-{orderId}'`

**Acceptance Criteria:**
- [ ] Token generation succeeds with production credentials
- [ ] STK Push sends prompt to Kenyan phone number
- [ ] Order record created in DB before STK call
- [ ] `CheckoutRequestID` stored in `payments` table
- [ ] Phone validation: must be Kenyan format (07XX or 254XX)

---

### TASK-019: M-Pesa Callback Handler
**Status:** `[ ]`  
**Priority:** P0

**File:** `app/api/mpesa/callback/route.ts`

On success (`ResultCode === 0`):
1. Find payment by `CheckoutRequestID`
2. Extract `MpesaReceiptNumber` from `CallbackMetadata`
3. Update `payments`: status=`success`, `mpesa_receipt`
4. Update `orders`: status=`payment_confirmed`, `mpesa_receipt`
5. Decrement stock for each order item
6. Send order confirmation email: "Your beauty essentials are on their way"
7. Increment coupon `used_count` if applicable
8. Clear customer's cart

On failure:
1. Update `payments`: status=`failed`
2. Update `orders`: status=`cancelled`
3. Restore stock
4. Send payment failed notification

Always return HTTP 200 to Safaricom.

**Acceptance Criteria:**
- [ ] Success callback updates order to `payment_confirmed`
- [ ] Failure callback updates order to `cancelled`
- [ ] Stock decremented correctly on success
- [ ] Order confirmation email triggered
- [ ] Always returns HTTP 200
- [ ] `MpesaReceiptNumber` stored on order

---

### TASK-020: Checkout Status Polling
**Status:** `[ ]`  
**Priority:** P0

**File:** `components/storefront/PaymentWaiting.tsx`

- Show "Check your phone" with M-Pesa branding
- Poll `/api/orders/[id]/status` every 3 seconds
- Timeout after 90 seconds with clear error + retry
- On success: navigate to `/orders/[id]?success=true`

**Acceptance Criteria:**
- [ ] Polling starts immediately after STK Push
- [ ] Navigates to order confirmation on success
- [ ] Shows retry option after timeout or failure

---

### TASK-021: Order Confirmation Page
**Status:** `[ ]`  
**Priority:** P1

**File:** `app/(storefront)/orders/[id]/page.tsx`

Show:
- "Thank you for your order! Your beauty essentials are on their way 🌿" (if `?success=true`)
- Order number, date, status badge
- Items ordered (with shade name for color cosmetics)
- Delivery address
- M-Pesa receipt number
- Total paid
- Order timeline (status history)
- "Continue Shopping" CTA

**Acceptance Criteria:**
- [ ] Page shows correct order data including shade names
- [ ] Success message shown only on first visit
- [ ] Unauthorized user gets redirect to login

---

## PHASE 5 — Admin Dashboard

### TASK-022: Admin Layout & Auth Guard
**Status:** `[ ]`  
**Priority:** P0

**Files:** `app/(admin)/admin/layout.tsx`, `components/admin/Sidebar.tsx`

Sidebar navigation:
- Dashboard
- Products *(Skincare & Cosmetics)*
- Categories
- Orders
- Customers
- Coupons
- Reviews
- Analytics
- Settings

**Acceptance Criteria:**
- [ ] Admin layout renders for admin users
- [ ] Non-admin redirected away
- [ ] All sidebar links navigate correctly

---

### TASK-023: Admin Product Management — Skincare Fields
**Status:** `[ ]`  
**Priority:** P1

**Files:** `app/(admin)/admin/products/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`

**Product list table columns:**
- Image, Name, Brand, SKU, Category, Volume, Price, Stock, Vegan/CF icons, Published status, Actions

**Product form must include all standard fields PLUS these skincare-specific sections:**

```
[Skincare Attributes]
  Skin Type (multi-select)         — labelled "Skin Type", not "Tags"
    □ All Skin Types  □ Oily  □ Dry  □ Combination  □ Sensitive

  Skin Concerns (multi-select)     — labelled "Skin Concerns", not "Tags"  
    □ Acne & Blemishes    □ Anti-Aging       □ Hyperpigmentation
    □ Hydration           □ Brightening      □ Dark Circles
    □ Pores               □ Redness          □ Sensitivity

  Ingredient List                  — labelled "Ingredient List (INCI)"
    [textarea — full INCI names, e.g. "Aqua, Niacinamide, Zinc PCA..."]

  Volume / Size (ml)               — numeric input
  Finish                           — select: None / Matte / Dewy / Satin / Glossy / Natural
  SPF Value                        — numeric input (leave blank = no SPF)

[Colour / Shade]
  Shade Name                       — text input (e.g. "Warm Beige")
  Shade HEX                        — color picker input (#XXXXXX)
                                     Show live preview circle next to input

[Certifications]
  □ Vegan
  □ Cruelty-Free
  □ Natural / Organic
```

**Note:** The admin form must NOT use generic "Tags" labels. Use "Skin Concerns" and "Skin Type" only.

**Acceptance Criteria:**
- [ ] Product form saves all skincare fields to DB
- [ ] Skin concerns field labelled "Skin Concerns" (not "Tags")
- [ ] Skin type field labelled "Skin Type" (not "Tags")
- [ ] Shade HEX input shows live color preview circle
- [ ] Ingredient list textarea has placeholder INCI example text
- [ ] Saved product shows correct skin badges on storefront
- [ ] Slug auto-generates from product name

---

### TASK-024: Admin Orders Management
**Status:** `[ ]`  
**Priority:** P1

**Files:** `app/(admin)/admin/orders/page.tsx`, `[id]/page.tsx`

Orders list table: order #, customer, date, items (with shade info), total, M-Pesa receipt, status.

Order detail:
- Full order info including shade names in items list
- Status update dropdown + note + update button
- Status history timeline
- Customer skin profile (skin type + concerns) shown as reference

**Acceptance Criteria:**
- [ ] Orders list shows all orders
- [ ] Status update saves and adds to history
- [ ] Shade names visible in order items
- [ ] CSV export includes shade and variant info

---

### TASK-025: Admin Analytics Dashboard
**Status:** `[ ]`  
**Priority:** P2

**KPI Cards:**
- Total Revenue (today / 7d / 30d)
- Total Orders (status breakdown)
- AOV
- New Customers (period)

**Charts:**
- Revenue line chart (daily, last 30 days)
- Orders by status (donut)
- Top 10 products by revenue (bar chart)
- **Revenue by category** (Skincare vs. Makeup vs. Tools vs. Body — pie/donut)
- **Most filtered skin types** (bar chart from `analytics_events` payload)

**Acceptance Criteria:**
- [ ] All KPI cards show real data
- [ ] Revenue chart renders
- [ ] Category revenue breakdown chart visible
- [ ] Charts are responsive

---

### TASK-026: Admin Coupon Management
**Status:** `[ ]`  
**Priority:** P2

**File:** `app/(admin)/admin/coupons/page.tsx`

- Create coupons: `WELCOME10` (10% off), `GLOW200` (KES 200 off), `FREESHIP`
- Toggle active/inactive
- Usage stats per coupon

**Acceptance Criteria:**
- [ ] Create coupon saves correctly
- [ ] Expired coupon rejected at checkout
- [ ] Usage count increments on successful order

---

### TASK-027: Admin Review Moderation
**Status:** `[ ]`  
**Priority:** P2

**File:** `app/(admin)/admin/reviews/page.tsx`

- Queue of pending reviews
- Show: product, reviewer, skin type badge, rating, review text, date
- Approve / Reject buttons

**Acceptance Criteria:**
- [ ] Pending reviews appear in queue
- [ ] Reviewer skin type shown in moderation view
- [ ] Approve updates product rating

---

### TASK-028: User Skin Profile Page
**Status:** `[ ]`  
**Priority:** P2

**File:** `app/(storefront)/account/skin-profile/page.tsx`

Allow authenticated users to set their skin profile:

```
My Skin Profile

Skin Type
  ○ Oily   ○ Dry   ○ Combination   ○ Sensitive   ○ Normal

My Skin Concerns (select all that apply)
  □ Acne & Blemishes    □ Anti-Aging        □ Hyperpigmentation
  □ Hydration           □ Brightening       □ Dark Circles
  □ Pores               □ Redness

[Save My Skin Profile]
```

On save:
- Updates `profiles.skin_type` and `profiles.skin_concerns`
- Shows success toast: "Skin profile saved! We'll now personalise your recommendations."

**Acceptance Criteria:**
- [ ] Page accessible at `/account/skin-profile`
- [ ] Skin type radio saves to `profiles.skin_type`
- [ ] Concerns checkboxes save to `profiles.skin_concerns`
- [ ] Success toast shown after save
- [ ] Saved values pre-populate on next visit

---

## PHASE 6 — Email & Notifications

### TASK-029: Email Setup with Beauty Copy
**Status:** `[ ]`  
**Priority:** P1

**Files:** `lib/email/resend.ts`, `emails/` directory

Install React Email: `npm install @react-email/components react-email`

Create email templates with beauty/skincare brand voice:

| Template file | Subject | Trigger |
|--------------|---------|---------|
| `WelcomeEmail.tsx` | "Start your skincare journey with Anashe ✨" | Register |
| `OrderConfirmation.tsx` | "Order confirmed — your beauty essentials are on their way 🌿" | Payment success |
| `OrderStatusUpdate.tsx` | "Your Anashe order is [status]" | Status change |
| `AbandonedCart1.tsx` | "Your skincare picks are waiting 🌿" | 1hr abandonment |
| `AbandonedCart2.tsx` | "Don't forget your routine essentials" | 24hr + coupon |
| `AbandonedCart3.tsx` | "Last chance — your cart expires soon" | 72hr |
| `WishlistSaleAlert.tsx` | "A product on your wishlist just went on sale! 💛" | Sale on wishlisted product |
| `PostPurchaseRec.tsx` | "Complete your skincare routine" | 3 days post-delivery |

**Sender:** `Anashe <hello@siscom.africa>` (or configured Resend domain)

**WelcomeEmail body must include:**
- "Welcome to Anashe — your destination for authentic skincare and cosmetics in Kenya."
- Link to set skin profile: "Tell us your skin type → [Set My Skin Profile]"

**AbandonedCart1 body must include:**
- "Your skincare picks are waiting"
- List of cart items with product images
- "Complete my order" CTA linking back to cart

**OrderConfirmation body must include:**
- "Your beauty essentials are on their way"
- M-Pesa receipt number
- Items ordered (with shade names for color cosmetics)
- Estimated delivery

**Acceptance Criteria:**
- [ ] Welcome email sent on register with skin profile link
- [ ] Order confirmation sent after M-Pesa success with M-Pesa receipt
- [ ] Abandoned cart email 1 uses "Your skincare picks are waiting" subject
- [ ] All email subjects reflect beauty vertical (none say generic "Your order")
- [ ] Emails render correctly (test with React Email preview)

---

### TASK-030: Abandoned Cart Recovery Cron
**Status:** `[ ]`  
**Priority:** P2

**File:** `app/api/cron/abandoned-carts/route.ts`

Configure in `vercel.json`:
```json
{
  "crons": [{ "path": "/api/cron/abandoned-carts", "schedule": "*/30 * * * *" }]
}
```

Logic:
1. Find carts: `updated_at < now() - interval '1 hour'`, `abandoned_email_count < 3`, user authenticated, no completed order
2. Email 1 → send `AbandonedCart1` ("Your skincare picks are waiting")
3. Email 2 → send `AbandonedCart2` with 10% coupon auto-generated
4. Email 3 → send `AbandonedCart3` ("Last chance")
5. Stop if user placed order after cart abandonment

**Acceptance Criteria:**
- [ ] Cron job runs every 30 minutes
- [ ] Email 1 sent after 1 hour
- [ ] Email 2 sent after 24 hours (not before)
- [ ] Sequence stops after purchase
- [ ] Coupon generated for Email 2

---

## PHASE 7 — SEO

### TASK-031: Metadata & Structured Data — Skincare SEO
**Status:** `[ ]`  
**Priority:** P1

**Files:** `app/layout.tsx`, `app/(storefront)/products/[slug]/page.tsx`, `components/shared/JsonLd.tsx`

**`generateMetadata()` for product pages — must mention skin type + ingredients:**
```typescript
description: `Shop ${product.name} by ${product.brand}. ${
  product.skin_type?.length ? `Best for ${product.skin_type.join(' and ')} skin. ` : ''
}${product.concerns?.length ? `Targets ${product.concerns.join(', ')}. ` : ''
}${product.volume_ml ? `${product.volume_ml}ml. ` : ''
}KES ${product.sale_price ?? product.price} — Pay via M-Pesa in Kenya.`
```

**JSON-LD for product pages:**
- `Product` schema with `material` (ingredients), `additionalProperty` (skin type, concerns, volume, SPF)
- `AggregateRating` if reviews exist

**JSON-LD for category pages:**
- `FAQPage` schema with skincare-specific Q&As (per category)
- Serums: "What is a serum?", "How to layer serums?", "Best serum for oily skin Kenya?"
- Sunscreen: "What SPF for Kenya?", "Sunscreen indoors?", "SPF vs moisturiser?"
- Moisturisers: "What moisturiser for oily skin?", "Night cream vs day cream?"

**Acceptance Criteria:**
- [ ] Product page meta description mentions skin type and key ingredient/concern
- [ ] `additionalProperty` for skin type and concerns present in Product JSON-LD
- [ ] FAQPage JSON-LD present on serums and sunscreen category pages
- [ ] Google Rich Results Test passes for product pages
- [ ] OG tags visible when sharing links

---

### TASK-032: Sitemap & Robots
**Status:** `[ ]`  
**Priority:** P1

**Files:** `app/sitemap.ts`, `app/robots.ts`

Sitemap includes:
- Static pages: `/home`, `/products`, `/about`, `/blog`, `/contact`
- All published product URLs: `/products/[slug]`
- All active category URLs: `/categories/[slug]` (14 skincare categories)

Robots blocks: `/admin/`, `/api/`, `/checkout/`, `/account/`, `/auth/`

**Acceptance Criteria:**
- [ ] `/sitemap.xml` returns valid XML with all product + category URLs
- [ ] All 14 skincare category slugs included in sitemap
- [ ] `/robots.txt` blocks admin routes
- [ ] Sitemap validated by XML validator

---

## PHASE 8 — Security

### TASK-033: Input Validation & Rate Limiting
**Status:** `[ ]`  
**Priority:** P0

**Zod schemas for skincare-specific filter params:**
```typescript
export const ProductFilterSchema = z.object({
  q: z.string().max(100).optional(),
  category_id: z.string().uuid().optional(),
  skin_type: z.array(z.enum(['oily','dry','combination','sensitive','all'])).optional(),
  concerns: z.array(z.string().max(50)).optional(),
  finish: z.enum(['matte','dewy','satin','glossy','natural']).optional(),
  spf_min: z.number().int().min(0).max(100).optional(),
  spf_max: z.number().int().min(0).max(100).optional(),
  is_vegan: z.boolean().optional(),
  is_cruelty_free: z.boolean().optional(),
  is_natural: z.boolean().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  sort: z.enum(['relevance','price_asc','price_desc','newest','rating']).optional(),
  page: z.number().int().min(1).default(1),
});
```

Rate limiting:
- Auth endpoints: 5 req/min
- Checkout: 3 req/min per user
- Search: 30 req/min per IP

**Acceptance Criteria:**
- [ ] Invalid skin_type values rejected (422)
- [ ] Invalid SPF values rejected
- [ ] Too many auth attempts return 429
- [ ] Checkout validates Kenyan phone format

---

### TASK-034: Security Headers & CORS
**Status:** `[ ]`  
**Priority:** P1

**File:** `next.config.ts`

Standard security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`.

**Acceptance Criteria:**
- [ ] Security headers present (check securityheaders.com)
- [ ] Admin API routes return 401 for unauthenticated requests
- [ ] M-Pesa callback validates `CheckoutRequestID` before processing

---

## PHASE 9 — Testing & QA

### TASK-035: Unit Tests
**Status:** `[ ]`  
**Priority:** P1

Write tests with Vitest for:
- `lib/utils.ts` — `formatPrice`, `formatPhone`, `calculateDiscount`, `getStockStatus`
- M-Pesa phone formatting: 0712345678 → 254712345678
- Skin type filter logic (array overlap)
- Shade hex validation (valid HEX format)
- Coupon validation (expired, max uses, min order)

**Acceptance Criteria:**
- [ ] All unit tests pass
- [ ] Phone formatter handles all Kenyan number formats
- [ ] Shade hex validator rejects invalid formats
- [ ] Skin type filter correctly matches overlapping arrays

---

### TASK-036: E2E Tests
**Status:** `[ ]`  
**Priority:** P2

**File:** `tests/e2e/`

Critical path tests:
1. Filter by skin type "Oily" → verify only oily-compatible products shown → click product → verify skin type badges on detail page
2. Select shade on makeup product → add to cart → verify shade name in cart drawer
3. Browse by concern "Acne" → product detail → ingredient list accordion expands → irritant highlighted
4. Full checkout: browse → cart → checkout address → M-Pesa (mock) → success page
5. Admin: create skincare product with concerns and skin type → verify badges on storefront

**Acceptance Criteria:**
- [ ] All 5 E2E test scenarios pass
- [ ] Skin type filter test passes
- [ ] Shade selection test passes
- [ ] Ingredient accordion test passes

---

### TASK-037: Production Deployment
**Status:** `[ ]`  
**Priority:** P0

1. Set all production environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`
   - `MPESA_CALLBACK_URL=https://siscom.africa/api/mpesa/callback`
   - `MPESA_ENV=production`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL=https://siscom.africa`
2. Run migrations on production Supabase: `node scripts/run-migrations.mjs`
3. Seed production DB with 40–50 skincare products
4. Connect `siscom.africa` domain in Vercel
5. Verify Resend domain DNS records for `siscom.africa`
6. Run end-to-end smoke test on production:
   - Browse by concern (Acne) ✓
   - Filter by skin type (Oily) ✓
   - View product with ingredient list and shade selector ✓
   - Register new user + set skin profile ✓
   - Add to cart (with shade selection) ✓
   - Complete M-Pesa checkout (live, small amount) ✓
   - Receive confirmation email ✓
   - Admin: view order with shade in items ✓
7. Submit sitemap to Google Search Console
8. Enable Vercel Analytics

**Acceptance Criteria:**
- [ ] `https://siscom.africa` loads over HTTPS
- [ ] All environment variables set in Vercel
- [ ] Skin type and concern filters work on production
- [ ] Live M-Pesa payment completes end-to-end
- [ ] Shade selector works on color cosmetic products
- [ ] Ingredient list accordion opens on product page
- [ ] Confirmation email received with beauty copy
- [ ] Sitemap includes all 14 skincare category URLs

---

## Summary Checklist

| Phase | Tasks | Description |
|-------|-------|-------------|
| 0 — Setup | 001–004 | `[ ]` |
| 1 — Database | 005–007 | `[ ]` Skincare schema + 40–50 cosmetic products |
| 2 — Product Catalog | 008–013 | `[ ]` Skincare filters, shade selector, ingredients |
| 3 — Cart & Wishlist | 014–016 | `[ ]` |
| 4 — M-Pesa Checkout | 017–021 | `[ ]` |
| 5 — Admin Dashboard | 022–028 | `[ ]` Skincare fields, skin profile page |
| 6 — Email | 029–030 | `[ ]` Beauty copy |
| 7 — SEO | 031–032 | `[ ]` Skincare JSON-LD, FAQ schema |
| 8 — Security | 033–034 | `[ ]` |
| 9 — Testing & Launch | 035–037 | `[ ]` |
| **TOTAL** | **37 Tasks** | |

---

## Agent Notes

- Always run `supabase gen types typescript --project-id tkdqamzaqarmfoxxtypw > types/database.types.ts` after any schema change
- Never use `any` TypeScript type — use generated Supabase types
- All monetary values stored as `NUMERIC(10,2)` in KES (Kenyan Shillings)
- M-Pesa amount must be an integer — always `Math.ceil(amount)` before STK push
- Phone numbers for M-Pesa must be in format `254XXXXXXXXX` (no +, no leading 0)
- `MPESA_ENV=production` is already set — uses `api.safaricom.co.ke`
- Shade hex values must match regex `/^#[0-9A-Fa-f]{6}$/` — validate before saving
- `skin_type` arrays on products use lowercase: `['oily','dry','combination','sensitive','all']`
- `concerns` arrays use hyphenated lowercase: `['anti-aging','hyperpigmentation','dark-circles']`
- Ingredient list is plain text (INCI format) — sanitize with DOMPurify before rendering
- Use `revalidatePath()` after admin mutations to clear Next.js cache
- Keep API routes lean — business logic goes in `lib/` modules
- The domain is `siscom.africa` (not `anashe.co.ke`) — update any hardcoded URLs
- Supabase publishable key env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (support both old ANON_KEY and new key names)
