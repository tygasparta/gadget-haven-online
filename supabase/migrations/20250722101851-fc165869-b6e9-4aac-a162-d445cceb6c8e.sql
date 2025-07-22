
-- Create payment_records table to track all Paynow transactions
CREATE TABLE public.payment_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  payment_reference TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_method TEXT NOT NULL,
  poll_url TEXT,
  redirect_url TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for payment_records
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment records
CREATE POLICY "Users can view their own payment records" 
  ON public.payment_records 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payment_records.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Users can create payment records for their orders
CREATE POLICY "Users can create payment records for their orders" 
  ON public.payment_records 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payment_records.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- System can update payment records (for webhook updates)
CREATE POLICY "System can update payment records" 
  ON public.payment_records 
  FOR UPDATE 
  USING (true);

-- Admins can manage all payment records
CREATE POLICY "Admins can manage payment records" 
  ON public.payment_records 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add payment_reference column to orders table for tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Create index for faster lookups
CREATE INDEX idx_payment_records_reference ON public.payment_records(payment_reference);
CREATE INDEX idx_payment_records_order_id ON public.payment_records(order_id);
CREATE INDEX idx_orders_payment_reference ON public.orders(payment_reference);

-- Add trigger to update updated_at column
CREATE TRIGGER update_payment_records_updated_at 
  BEFORE UPDATE ON public.payment_records 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
