
-- WhatsApp cart items table for tracking cart per phone number
CREATE TABLE public.whatsapp_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  product_id integer NOT NULL REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(phone_number, product_id)
);

-- Add source column to orders to track WhatsApp orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS source text DEFAULT 'website';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone text;

-- Enable RLS
ALTER TABLE public.whatsapp_cart_items ENABLE ROW LEVEL SECURITY;

-- Allow system (service role) full access - bot uses service role key
CREATE POLICY "System can manage whatsapp cart items"
  ON public.whatsapp_cart_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_whatsapp_cart_phone ON public.whatsapp_cart_items(phone_number);
