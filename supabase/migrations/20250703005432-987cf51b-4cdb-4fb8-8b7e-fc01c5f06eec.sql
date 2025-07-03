-- Ensure admin role is assigned to info@gadgetgenie.org
-- First check if user exists and get their ID
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for info@gadgetgenie.org
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'info@gadgetgenie.org';
    
    IF admin_user_id IS NOT NULL THEN
        -- Insert admin role if it doesn't exist
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (admin_user_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role assigned to user: %', admin_user_id;
    ELSE
        RAISE NOTICE 'User info@gadgetgenie.org not found in auth.users table';
    END IF;
END $$;