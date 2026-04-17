-- ================================================================
-- Checkout RLS fixes: allow authenticated users to create orders
-- and related rows (order_items, payments) for their own orders.
-- ================================================================

-- ORDERS
DROP POLICY IF EXISTS "orders_own_select" ON orders;
CREATE POLICY "orders_own_select" ON orders
  FOR SELECT
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

-- ORDER ITEMS
DROP POLICY IF EXISTS "order_items_own_select" ON order_items;
CREATE POLICY "order_items_own_select" ON order_items
  FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "order_items_own_insert" ON order_items;
CREATE POLICY "order_items_own_insert" ON order_items
  FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- PAYMENTS
DROP POLICY IF EXISTS "payments_own_select" ON payments;
CREATE POLICY "payments_own_select" ON payments
  FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "payments_own_insert" ON payments;
CREATE POLICY "payments_own_insert" ON payments
  FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

