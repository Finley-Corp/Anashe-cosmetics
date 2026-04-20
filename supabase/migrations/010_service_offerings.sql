-- Service offerings catalog used by storefront booking form and admin management
CREATE TABLE IF NOT EXISTS public.service_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_offerings_active_name
  ON public.service_offerings (is_active, name);

INSERT INTO public.service_offerings (name, slug, description, is_active)
VALUES
  ('Skin Consultation', 'skin-consultation', 'One-on-one expert assessment for your skin type and concerns.', true),
  ('Routine Planning Session', 'routine-planning', 'AM/PM routine plan matched to goals and budget.', true),
  ('Product Matching Session', 'product-matching', 'Product recommendations based on your current regimen.', true),
  ('Bridal Beauty Consultation', 'bridal-beauty-consult', 'Timeline-based prep and product strategy for events.', true)
ON CONFLICT (slug) DO NOTHING;
