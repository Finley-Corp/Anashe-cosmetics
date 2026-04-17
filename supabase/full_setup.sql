-- ================================================================
-- Anashe Skincare & Cosmetics — Initial Schema
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tkdqamzaqarmfoxxtypw/sql/new
-- ================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================================
-- PROFILES (extends auth.users) — includes skin profile
-- ================================================================
CREATE TABLE IF NOT EXISTS profiles (
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

-- ================================================================
-- ADDRESSES
-- ================================================================
CREATE TABLE IF NOT EXISTS addresses (
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

-- ================================================================
-- CATEGORIES (14 skincare/cosmetic categories)
-- ================================================================
CREATE TABLE IF NOT EXISTS categories (
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

-- ================================================================
-- PRODUCTS — with skincare/cosmetic-specific columns
-- ================================================================
CREATE TABLE IF NOT EXISTS products (
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
  tags TEXT[] DEFAULT '{}',

  -- Skincare-specific columns
  skin_type TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  ingredients TEXT,
  volume_ml NUMERIC(6,1),
  finish TEXT CHECK (finish IN ('matte','dewy','satin','glossy','natural')),
  shade TEXT,
  shade_hex TEXT,
  spf INT,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_cruelty_free BOOLEAN DEFAULT FALSE,
  is_natural BOOLEAN DEFAULT FALSE,

  -- Standard fields
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

-- ================================================================
-- PRODUCT IMAGES
-- ================================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE
);

-- ================================================================
-- PRODUCT VARIANTS
-- ================================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '{}',
  price_modifier NUMERIC(10,2) DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- CARTS
-- ================================================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  abandoned_email_count INT DEFAULT 0,
  last_abandoned_email_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  variant_id UUID REFERENCES product_variants(id),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- WISHLISTS
-- ================================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wishlist_id, product_id)
);

-- ================================================================
-- COUPONS
-- ================================================================
CREATE TABLE IF NOT EXISTS coupons (
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

-- ================================================================
-- ORDERS
-- ================================================================
CREATE TABLE IF NOT EXISTS orders (
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

CREATE TABLE IF NOT EXISTS order_items (
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

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- PAYMENTS
-- ================================================================
CREATE TABLE IF NOT EXISTS payments (
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

-- ================================================================
-- REVIEWS — includes reviewer skin_type for context
-- ================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  skin_type TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id, order_id)
);

CREATE TABLE IF NOT EXISTS review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  UNIQUE(review_id, user_id)
);

-- ================================================================
-- SERVICE BOOKINGS
-- ================================================================
CREATE TABLE IF NOT EXISTS service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_service_bookings_created_at ON service_bookings(created_at DESC);

-- ================================================================
-- CUSTOMER CONTACTS (admin-managed CRM list)
-- ================================================================
CREATE TABLE IF NOT EXISTS customer_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_contacts_created_at ON customer_contacts(created_at DESC);

-- ================================================================
-- ANALYTICS
-- ================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  product_id UUID REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_skin_type ON products USING GIN(skin_type);
CREATE INDEX IF NOT EXISTS idx_products_concerns ON products USING GIN(concerns);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_spf ON products(spf) WHERE spf IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type, created_at);

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Search vector: includes concerns, skin_type, ingredients for ingredient search
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

DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Auto-update product rating on review change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    average_rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE), 0),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rating_trigger ON reviews;
CREATE TRIGGER update_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Auto-create profile + wishlist on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    'customer'
  ) ON CONFLICT (id) DO NOTHING;
  INSERT INTO wishlists (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
-- ================================================================
-- Anashe E-Commerce — Row Level Security Policies
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- PROFILES
-- ================================================================
DROP POLICY IF EXISTS "profiles_own" ON profiles;
CREATE POLICY "profiles_own" ON profiles
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin" ON profiles;
CREATE POLICY "profiles_admin" ON profiles
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ================================================================
-- PRODUCTS — public read for published, admin write all
-- ================================================================
DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "products_admin_all" ON products;
CREATE POLICY "products_admin_all" ON products
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ================================================================
-- CATEGORIES — public read active
-- ================================================================
DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "categories_admin" ON categories;
CREATE POLICY "categories_admin" ON categories
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ================================================================
-- PRODUCT IMAGES — public read
-- ================================================================
DROP POLICY IF EXISTS "product_images_public" ON product_images;
CREATE POLICY "product_images_public" ON product_images
  FOR SELECT USING (TRUE);

-- ================================================================
-- PRODUCT VARIANTS — public read
-- ================================================================
DROP POLICY IF EXISTS "variants_public" ON product_variants;
CREATE POLICY "variants_public" ON product_variants
  FOR SELECT USING (TRUE);

-- ================================================================
-- CART — users see own cart
-- ================================================================
DROP POLICY IF EXISTS "cart_own" ON carts;
CREATE POLICY "cart_own" ON carts
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_items_own" ON cart_items;
CREATE POLICY "cart_items_own" ON cart_items
  USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));

-- ================================================================
-- WISHLIST — users see own
-- ================================================================
DROP POLICY IF EXISTS "wishlist_own" ON wishlists;
DROP POLICY IF EXISTS "wishlist_own_select" ON wishlists;
DROP POLICY IF EXISTS "wishlist_own_insert" ON wishlists;
DROP POLICY IF EXISTS "wishlist_own_delete" ON wishlists;
CREATE POLICY "wishlist_own_select" ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "wishlist_own_insert" ON wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_own_delete" ON wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlist_items_own" ON wishlist_items;
DROP POLICY IF EXISTS "wishlist_items_own_select" ON wishlist_items;
DROP POLICY IF EXISTS "wishlist_items_own_insert" ON wishlist_items;
DROP POLICY IF EXISTS "wishlist_items_own_delete" ON wishlist_items;
CREATE POLICY "wishlist_items_own_select" ON wishlist_items
  FOR SELECT
  USING (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));
CREATE POLICY "wishlist_items_own_insert" ON wishlist_items
  FOR INSERT
  WITH CHECK (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));
CREATE POLICY "wishlist_items_own_delete" ON wishlist_items
  FOR DELETE
  USING (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));

-- ================================================================
-- ORDERS — users see own, admins see all
-- ================================================================
DROP POLICY IF EXISTS "orders_own" ON orders;
CREATE POLICY "orders_own" ON orders
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_own_insert" ON orders;
CREATE POLICY "orders_own_insert" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_own_update" ON orders;
CREATE POLICY "orders_own_update" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_admin" ON orders;
CREATE POLICY "orders_admin" ON orders
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "order_items_own" ON order_items;
CREATE POLICY "order_items_own" ON order_items
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "order_items_own_insert" ON order_items;
CREATE POLICY "order_items_own_insert" ON order_items
  FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- PAYMENTS — users can create/view payments for their orders
DROP POLICY IF EXISTS "payments_own_select" ON payments;
CREATE POLICY "payments_own_select" ON payments
  FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "payments_own_insert" ON payments;
CREATE POLICY "payments_own_insert" ON payments
  FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- ================================================================
-- REVIEWS — public read approved, authenticated write own
-- ================================================================
DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (is_approved = TRUE);

DROP POLICY IF EXISTS "reviews_own_write" ON reviews;
CREATE POLICY "reviews_own_write" ON reviews
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_admin" ON reviews;
CREATE POLICY "reviews_admin" ON reviews
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ================================================================
-- COUPONS — authenticated read active
-- ================================================================
DROP POLICY IF EXISTS "coupons_auth_read" ON coupons;
CREATE POLICY "coupons_auth_read" ON coupons
  FOR SELECT USING (is_active = TRUE AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "coupons_admin" ON coupons;
CREATE POLICY "coupons_admin" ON coupons
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ================================================================
-- SERVICE BOOKINGS — public create, admin read/update
-- ================================================================
DROP POLICY IF EXISTS "service_bookings_public_insert" ON service_bookings;
CREATE POLICY "service_bookings_public_insert" ON service_bookings
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "service_bookings_admin_all" ON service_bookings;
CREATE POLICY "service_bookings_admin_all" ON service_bookings
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ================================================================
-- CUSTOMER CONTACTS — admin only
-- ================================================================
DROP POLICY IF EXISTS "customer_contacts_admin_all" ON customer_contacts;
CREATE POLICY "customer_contacts_admin_all" ON customer_contacts
  FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
