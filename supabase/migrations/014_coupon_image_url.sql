-- Add optional image for discount/coupon cards
ALTER TABLE public.coupons
ADD COLUMN IF NOT EXISTS image_url TEXT;
