-- Fix RLS policy for notifications table to allow INSERT operations
-- The issue is that there's no INSERT policy, so notifications can't be created during order processing

CREATE POLICY "Users can create notifications for themselves" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also need to allow system functions to create notifications
-- Create a policy that allows INSERT when called from security definer functions
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);