
-- Add deleted_at column to products table for soft deletes
ALTER TABLE public.products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for better performance on soft delete queries
CREATE INDEX idx_products_deleted_at ON public.products(deleted_at);

-- Update the existing RLS policies to exclude soft deleted products for regular users
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

-- Create new policy that excludes soft deleted products for regular viewing
CREATE POLICY "Products are viewable by everyone (not deleted)" 
  ON public.products 
  FOR SELECT 
  USING (deleted_at IS NULL);

-- Create policy for admins to view all products including soft deleted ones
CREATE POLICY "Admins can view all products including deleted" 
  ON public.products 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Update admin policies to work with soft deletes
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Create policy for admins to soft delete products (set deleted_at)
CREATE POLICY "Admins can soft delete products" 
  ON public.products 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));
