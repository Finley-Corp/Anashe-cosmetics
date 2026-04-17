-- ================================================================
-- Wishlist RLS fix: allow authenticated insert/delete flows
-- ================================================================

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Own wishlist row
DROP POLICY IF EXISTS "wishlist_own" ON wishlists;
CREATE POLICY "wishlist_own_select" ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "wishlist_own_insert" ON wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlist_own_delete" ON wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- Wishlist items tied to current user's wishlist
DROP POLICY IF EXISTS "wishlist_items_own" ON wishlist_items;
CREATE POLICY "wishlist_items_own_select" ON wishlist_items
  FOR SELECT
  USING (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));

CREATE POLICY "wishlist_items_own_insert" ON wishlist_items
  FOR INSERT
  WITH CHECK (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));

CREATE POLICY "wishlist_items_own_delete" ON wishlist_items
  FOR DELETE
  USING (wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid()));
