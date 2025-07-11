
-- Add specifications column to products table
ALTER TABLE public.products 
ADD COLUMN specifications JSONB DEFAULT '[]'::jsonb;
