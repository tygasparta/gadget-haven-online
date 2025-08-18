-- Add 2% to all existing products
UPDATE products 
SET 
  price = ROUND(price * 1.02, 2),
  original_price = CASE 
    WHEN original_price IS NOT NULL THEN ROUND(original_price * 1.02, 2)
    ELSE NULL 
  END,
  updated_at = now()
WHERE deleted_at IS NULL;