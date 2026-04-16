-- ================================================================
-- Supabase Storage — product images bucket + policies
-- ================================================================

-- Create a public bucket to host product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Public read access for product images
DROP POLICY IF EXISTS "product_images_bucket_public_read" ON storage.objects;
CREATE POLICY "product_images_bucket_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Admin-only write access (insert/update/delete)
DROP POLICY IF EXISTS "product_images_bucket_admin_write" ON storage.objects;
CREATE POLICY "product_images_bucket_admin_write"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'product-images'
    AND (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'product-images'
    AND (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
  );

