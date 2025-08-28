-- Add shipping method to orders table to track how customer wants to receive their order
ALTER TABLE public.orders 
ADD COLUMN shipping_method text DEFAULT 'collection' CHECK (shipping_method IN ('shipping', 'collection'));

-- Add comment for clarity
COMMENT ON COLUMN public.orders.shipping_method IS 'Method of delivery: shipping ($5 fee) or collection (free at shop)';