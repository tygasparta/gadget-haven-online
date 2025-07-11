
-- Add new columns to products table for colors, what's in the box, and tags
ALTER TABLE public.products 
ADD COLUMN colors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN whats_in_box TEXT[],
ADD COLUMN tags TEXT[];

-- Create product_colors table for predefined color options
CREATE TABLE public.product_colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  hex_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default colors
INSERT INTO public.product_colors (name, hex_code) VALUES
('Black', '#000000'),
('White', '#FFFFFF'),
('Red', '#FF0000'),
('Blue', '#0000FF'),
('Green', '#008000'),
('Yellow', '#FFFF00'),
('Purple', '#800080'),
('Orange', '#FFA500'),
('Pink', '#FFC0CB'),
('Gray', '#808080'),
('Silver', '#C0C0C0'),
('Gold', '#FFD700'),
('Rose Gold', '#E8B4B8'),
('Space Gray', '#4A4A4A'),
('Midnight', '#191970');

-- Enable RLS for product_colors (public read access)
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product colors are viewable by everyone" 
  ON public.product_colors 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage product colors" 
  ON public.product_colors 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));
