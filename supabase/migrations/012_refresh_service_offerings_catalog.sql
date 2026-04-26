-- Refresh service offerings catalog to match the latest business menu.
WITH desired_services(name, slug, description) AS (
  VALUES
    ('Facial Treatments - Dpn Removal', 'facial-treatments-dpn-removal', NULL),
    ('Facial Treatments - Timeless Facial', 'facial-treatments-timeless-facial', NULL),
    ('Facial Treatments - Deep Treatment Facial', 'facial-treatments-deep-treatment-facial', NULL),
    ('Facial Treatments - Glow Fusion Facial', 'facial-treatments-glow-fusion-facial', NULL),
    ('Facial Treatments - Royal Facial', 'facial-treatments-royal-facial', NULL),
    ('Facial Treatments - Hydrafacial', 'facial-treatments-hydrafacial', NULL),
    ('Facial Treatments - Pampering Relaxing Facial', 'facial-treatments-pampering-relaxing-facial', NULL),
    ('Facial Treatments - Enzyme Peel', 'facial-treatments-enzyme-peel', NULL),
    ('Advanced Skin Treatments - Chemical Peels', 'advanced-skin-treatments-chemical-peels', NULL),
    ('Advanced Skin Treatments - Microneedling', 'advanced-skin-treatments-microneedling', NULL),
    ('Advanced Skin Treatments - PRP Microneedling (Vampire Facial)', 'advanced-skin-treatments-prp-microneedling-vampire-facial', NULL),
    ('Advanced Skin Treatments - Dermaplaning', 'advanced-skin-treatments-dermaplaning', NULL),
    ('Advanced Skin Treatments - Mesotherapy', 'advanced-skin-treatments-mesotherapy', NULL),
    ('Advanced Skin Treatments - Botox', 'advanced-skin-treatments-botox', NULL),
    ('Advanced Skin Treatments - Dermabrasion', 'advanced-skin-treatments-dermabrasion', NULL),
    ('Body Treatments & Massages - Body Scrub', 'body-treatments-massages-body-scrub', NULL),
    ('Body Treatments & Massages - Swedish Massage', 'body-treatments-massages-swedish-massage', NULL),
    ('Body Treatments & Massages - Deep Tissue Massage', 'body-treatments-massages-deep-tissue-massage', NULL),
    ('Body Treatments & Massages - Neck & Back Massage', 'body-treatments-massages-neck-back-massage', NULL),
    ('Bridal & Pre-Wedding Treatments', 'bridal-pre-wedding-treatments', NULL),
    ('Skin Tags & Acne Treatment - Skin Tags Removal', 'skin-tags-acne-treatment-skin-tags-removal', NULL),
    ('Skin Tags & Acne Treatment - Teen Acne Treatment', 'skin-tags-acne-treatment-teen-acne-treatment', NULL),
    ('Skin Consultations & Analysis - Skin Consultation', 'skin-consultations-analysis-skin-consultation', NULL),
    ('Skin Consultations & Analysis - Skin Analysis', 'skin-consultations-analysis-skin-analysis', NULL),
    ('Waxing Services - Underarm Waxing', 'waxing-services-underarm-waxing', NULL),
    ('Waxing Services - Bikini Waxing', 'waxing-services-bikini-waxing', NULL),
    ('Waxing Services - Brazilian Waxing', 'waxing-services-brazilian-waxing', NULL),
    ('Waxing Services - Full Body Waxing', 'waxing-services-full-body-waxing', NULL),
    ('Specialty Treatments - Vagacial', 'specialty-treatments-vagacial', NULL)
)
INSERT INTO public.service_offerings (name, slug, description, is_active)
SELECT name, slug, description, true
FROM desired_services
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = true;

UPDATE public.service_offerings
SET is_active = false
WHERE slug NOT IN (
  SELECT slug
  FROM (
    VALUES
      ('facial-treatments-dpn-removal'),
      ('facial-treatments-timeless-facial'),
      ('facial-treatments-deep-treatment-facial'),
      ('facial-treatments-glow-fusion-facial'),
      ('facial-treatments-royal-facial'),
      ('facial-treatments-hydrafacial'),
      ('facial-treatments-pampering-relaxing-facial'),
      ('facial-treatments-enzyme-peel'),
      ('advanced-skin-treatments-chemical-peels'),
      ('advanced-skin-treatments-microneedling'),
      ('advanced-skin-treatments-prp-microneedling-vampire-facial'),
      ('advanced-skin-treatments-dermaplaning'),
      ('advanced-skin-treatments-mesotherapy'),
      ('advanced-skin-treatments-botox'),
      ('advanced-skin-treatments-dermabrasion'),
      ('body-treatments-massages-body-scrub'),
      ('body-treatments-massages-swedish-massage'),
      ('body-treatments-massages-deep-tissue-massage'),
      ('body-treatments-massages-neck-back-massage'),
      ('bridal-pre-wedding-treatments'),
      ('skin-tags-acne-treatment-skin-tags-removal'),
      ('skin-tags-acne-treatment-teen-acne-treatment'),
      ('skin-consultations-analysis-skin-consultation'),
      ('skin-consultations-analysis-skin-analysis'),
      ('waxing-services-underarm-waxing'),
      ('waxing-services-bikini-waxing'),
      ('waxing-services-brazilian-waxing'),
      ('waxing-services-full-body-waxing'),
      ('specialty-treatments-vagacial')
  ) AS keep(slug)
);
