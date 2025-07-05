
-- Update RLS policy to allow admins to view all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure admins can view all user roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));
