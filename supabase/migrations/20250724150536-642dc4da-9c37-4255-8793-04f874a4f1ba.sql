
-- Update the password for the admin user info@gadgetgenie.org
-- This will hash the new password and update the auth.users table
UPDATE auth.users 
SET 
  encrypted_password = crypt('gadgetgenie23@2025', gen_salt('bf')),
  updated_at = now()
WHERE email = 'info@gadgetgenie.org';
