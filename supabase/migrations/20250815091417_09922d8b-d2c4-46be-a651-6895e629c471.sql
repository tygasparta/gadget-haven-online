
-- Add 2% tax to all existing products
UPDATE public.products 
SET price = price * 1.02
WHERE deleted_at IS NULL;

-- Update original_price as well if it exists
UPDATE public.products 
SET original_price = original_price * 1.02
WHERE original_price IS NOT NULL AND deleted_at IS NULL;
