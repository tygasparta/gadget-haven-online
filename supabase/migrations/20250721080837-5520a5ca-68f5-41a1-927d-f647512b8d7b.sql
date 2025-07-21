
-- Add RLS policies to allow admins to manage products even with existing orders
-- First, we need to update the foreign key constraint to allow cascading deletes
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Add the foreign key back with CASCADE delete to allow product deletion
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Similarly for cart_items
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;

ALTER TABLE public.cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- And for wishlists
ALTER TABLE public.wishlists 
DROP CONSTRAINT IF EXISTS wishlists_product_id_fkey;

ALTER TABLE public.wishlists 
ADD CONSTRAINT wishlists_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
