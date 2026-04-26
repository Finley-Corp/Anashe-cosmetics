CREATE TABLE IF NOT EXISTS testimonials_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT,
  message TEXT NOT NULL,
  avatar_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_feedback_approved_created
  ON testimonials_feedback(is_approved, created_at DESC);

ALTER TABLE testimonials_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_feedback_public_insert" ON testimonials_feedback;
CREATE POLICY "testimonials_feedback_public_insert" ON testimonials_feedback
  FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "testimonials_feedback_public_read_approved" ON testimonials_feedback;
CREATE POLICY "testimonials_feedback_public_read_approved" ON testimonials_feedback
  FOR SELECT
  USING (is_approved = TRUE);

DROP POLICY IF EXISTS "testimonials_feedback_admin_all" ON testimonials_feedback;
CREATE POLICY "testimonials_feedback_admin_all" ON testimonials_feedback
  FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
