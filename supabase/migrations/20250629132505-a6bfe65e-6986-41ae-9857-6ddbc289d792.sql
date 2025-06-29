
-- Check if the admin role exists for the user
SELECT ur.*, au.email 
FROM user_roles ur 
JOIN auth.users au ON ur.user_id = au.id 
WHERE au.email = 'info@gadgetgenie.org';

-- If no role exists, insert the admin role
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'info@gadgetgenie.org'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the role was inserted
SELECT ur.*, au.email 
FROM user_roles ur 
JOIN auth.users au ON ur.user_id = au.id 
WHERE au.email = 'info@gadgetgenie.org';
