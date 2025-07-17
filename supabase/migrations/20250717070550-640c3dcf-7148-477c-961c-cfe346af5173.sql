
-- Remove all existing demo products
DELETE FROM products WHERE id > 0;

-- Remove all existing demo orders and order items
DELETE FROM order_items WHERE id IS NOT NULL;
DELETE FROM orders WHERE id IS NOT NULL;

-- Reset the products sequence to start from 1
ALTER SEQUENCE products_id_seq RESTART WITH 1;
