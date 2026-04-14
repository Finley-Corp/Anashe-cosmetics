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
CREATE POLICY "wishlist_own" ON wishlists
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlist_items_own" ON wishlist_items;
CREATE POLICY "wishlist_items_own" ON wishlist_items
  USING (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));

-- ================================================================
-- ORDERS — users see own, admins see all
-- ================================================================
DROP POLICY IF EXISTS "orders_own" ON orders;
CREATE POLICY "orders_own" ON orders
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_admin" ON orders;
CREATE POLICY "orders_admin" ON orders
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "order_items_own" ON order_items;
CREATE POLICY "order_items_own" ON order_items
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

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
