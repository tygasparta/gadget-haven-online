
-- Make the gallary bucket public so images can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'gallary';
