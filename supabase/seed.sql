-- ================================================================
-- Anashe E-Commerce — Seed Data
-- ================================================================

-- Categories
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
  ('Electronics', 'electronics', 'Phones, laptops, gadgets and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80', 1, true),
  ('Fashion', 'fashion', 'Clothing, shoes and accessories for men and women', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80', 2, true),
  ('Home & Kitchen', 'home-kitchen', 'Furniture, appliances and home decor', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', 3, true),
  ('Beauty', 'beauty', 'Skincare, haircare and cosmetics', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', 4, true),
  ('Sports', 'sports', 'Fitness equipment and sports gear', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80', 5, true),
  ('Books', 'books', 'Fiction, non-fiction, academic and more', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', 6, true),
  ('Food & Groceries', 'food', 'Organic foods, spices and specialty items', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80', 7, true),
  ('Baby & Kids', 'baby-kids', 'Toys, clothing and essentials for children', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, slug, short_description, price, sale_price, stock, sku, brand, tags, is_published, is_featured) VALUES
  ('Premium Wireless Earbuds', 'premium-wireless-earbuds', 'Crystal clear audio with ANC and 24hr battery life', 4500, 3800, 24, 'EAR-001', 'SoundPro', ARRAY['electronics', 'audio', 'wireless'], true, true),
  ('Linen Summer Dress', 'linen-summer-dress', 'Breathable linen perfect for Kenyan summers', 3200, null, 15, 'DRESS-002', 'AfriStyle', ARRAY['fashion', 'women', 'summer'], true, false),
  ('Organic Honey 500g', 'organic-honey-500g', 'Raw unfiltered honey from Kenyan beekeepers', 850, null, 50, 'FOOD-003', 'NaturePure', ARRAY['food', 'organic', 'honey'], true, false),
  ('Smart Water Bottle', 'smart-water-bottle', 'Track hydration with smart LED temperature display', 2100, 1750, 8, 'BTL-004', 'HydroSmart', ARRAY['lifestyle', 'health', 'fitness'], true, true),
  ('Running Shoes Pro', 'running-shoes-pro', 'Lightweight running shoes with responsive cushioning', 5500, null, 12, 'SHOE-005', 'SpeedFit', ARRAY['sports', 'shoes', 'running'], true, false),
  ('Vitamin C Face Serum', 'vitamin-c-face-serum', 'Brightening serum with 20% Vitamin C and hyaluronic acid', 2800, null, 30, 'BEA-006', 'GlowLab', ARRAY['beauty', 'skincare', 'serum'], true, true),
  ('Leather Bi-fold Wallet', 'leather-bifold-wallet', 'Genuine leather wallet with RFID blocking', 1900, null, 25, 'WAL-007', 'CraftCo', ARRAY['fashion', 'accessories', 'men'], true, false),
  ('Coffee Maker 1.5L', 'coffee-maker-1-5l', 'Drip coffee maker with programmable timer and thermal carafe', 6500, null, 10, 'KIT-008', 'BrewMaster', ARRAY['home', 'kitchen', 'coffee'], true, false),
  ('Yoga Mat Premium', 'yoga-mat-premium', '6mm thick non-slip yoga mat with carrying strap', 1200, 950, 40, 'SPT-009', 'ZenFit', ARRAY['sports', 'yoga', 'fitness'], true, false),
  ('Polarized Sunglasses', 'polarized-sunglasses', 'UV400 protection polarized lenses in lightweight frame', 3400, null, 18, 'ACC-010', 'StyleVision', ARRAY['fashion', 'accessories', 'sunglasses'], true, false)
ON CONFLICT (slug) DO NOTHING;

-- Coupons
INSERT INTO coupons (code, description, type, value, min_order_value, max_uses, per_user_limit, is_active, expires_at) VALUES
  ('WELCOME10', '10% off your first order', 'percentage', 10, 500, 1000, 1, true, '2026-12-31 23:59:59+03'),
  ('SAVE200', 'KES 200 off orders over KES 1,000', 'fixed', 200, 1000, 500, 2, true, '2026-12-31 23:59:59+03'),
  ('FREESHIP', 'Free shipping on any order', 'free_shipping', 0, 0, null, 5, true, '2026-06-30 23:59:59+03'),
  ('ANASHE15', '15% off all electronics', 'percentage', 15, 2000, 200, 1, true, '2026-09-30 23:59:59+03')
ON CONFLICT (code) DO NOTHING;
