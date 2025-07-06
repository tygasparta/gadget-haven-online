
-- Add RLS policies to allow admins to manage products
CREATE POLICY "Admins can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products" 
  ON public.products 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products" 
  ON public.products 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));
