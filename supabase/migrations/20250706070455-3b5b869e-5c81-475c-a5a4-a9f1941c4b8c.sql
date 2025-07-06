
-- Create RLS policies for the gallary storage bucket to allow admins to upload images
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallary' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can view images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'gallary' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'gallary' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallary' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Also allow public read access to images so they can be displayed on the site
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallary');
