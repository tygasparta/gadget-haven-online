
-- Create policies for the 'images' storage bucket to allow admin uploads and public viewing

-- Allow admins to upload images to the 'images' bucket
CREATE POLICY "Admins can upload to images bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Allow admins to view images in the 'images' bucket
CREATE POLICY "Admins can view images in images bucket" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'images' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Allow admins to update images in the 'images' bucket
CREATE POLICY "Admins can update images in images bucket" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'images' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Allow admins to delete images from the 'images' bucket
CREATE POLICY "Admins can delete images from images bucket" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Allow public read access to images so they can be displayed on the site
CREATE POLICY "Public can view images in images bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Create a new table to store product galleries (multiple images per product)
CREATE TABLE public.product_galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for product galleries
ALTER TABLE public.product_galleries ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage product galleries
CREATE POLICY "Admins can manage product galleries" ON public.product_galleries
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public to view product galleries
CREATE POLICY "Public can view product galleries" ON public.product_galleries
  FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX idx_product_galleries_product_id ON public.product_galleries(product_id);
CREATE INDEX idx_product_galleries_main ON public.product_galleries(product_id, is_main) WHERE is_main = true;
