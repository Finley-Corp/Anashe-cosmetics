-- Rider / courier details shown to customers when order is shipped (SMS + storefront).
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_rider_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_rider_phone TEXT;
