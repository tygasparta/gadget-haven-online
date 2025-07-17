
-- Add RLS policies to allow admins to manage orders
CREATE POLICY "Admins can view all orders" 
  ON public.orders 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete orders" 
  ON public.orders 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for order_items
CREATE POLICY "Admins can view all order items" 
  ON public.order_items 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete order items" 
  ON public.order_items 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));
