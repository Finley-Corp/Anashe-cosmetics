-- Service feedback submissions from storefront services page
CREATE TABLE IF NOT EXISTS service_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_feedback_created_at ON service_feedback(created_at DESC);
