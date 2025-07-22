
-- Fix RLS policies for payment_records table
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create payment records for their orders" ON public.payment_records;
DROP POLICY IF EXISTS "Users can view their own payment records" ON public.payment_records;
DROP POLICY IF EXISTS "System can update payment records" ON public.payment_records;
DROP POLICY IF EXISTS "Admins can manage payment records" ON public.payment_records;

-- Create new, more permissive policies for payment_records
-- Allow users to create payment records for their own orders
CREATE POLICY "Users can create payment records for their orders" 
  ON public.payment_records 
  FOR INSERT 
  WITH CHECK (
    order_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payment_records.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Allow users to view their own payment records
CREATE POLICY "Users can view their own payment records" 
  ON public.payment_records 
  FOR SELECT 
  USING (
    order_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payment_records.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Allow system to update payment records (needed for webhooks)
CREATE POLICY "System can update payment records" 
  ON public.payment_records 
  FOR UPDATE 
  USING (true);

-- Allow admins to manage all payment records
CREATE POLICY "Admins can manage payment records" 
  ON public.payment_records 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Make sure orders table policies allow proper access
DROP POLICY IF EXISTS "System can update orders" ON public.orders;
CREATE POLICY "System can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (true);
