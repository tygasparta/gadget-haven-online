-- Remove 2% fee from all existing product prices
UPDATE products 
SET price = ROUND(price / 1.02, 2),
    original_price = CASE 
        WHEN original_price IS NOT NULL THEN ROUND(original_price / 1.02, 2)
        ELSE NULL 
    END
WHERE deleted_at IS NULL;