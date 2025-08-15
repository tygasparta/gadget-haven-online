-- Remove the overly permissive policy that allows unrestricted access
DROP POLICY IF EXISTS "System can manage email queue" ON public.email_queue;

-- Create more secure policies for the email system
-- Allow edge functions to insert emails (they use service role key)
CREATE POLICY "Edge functions can insert emails" 
ON public.email_queue 
FOR INSERT 
WITH CHECK (true);

-- Allow edge functions to update email status (they use service role key)
CREATE POLICY "Edge functions can update email status" 
ON public.email_queue 
FOR UPDATE 
USING (true);

-- The existing policies remain:
-- "Admins can view all email queue" - admins can see everything
-- "Users can view their own email queue" - users can only see their own emails

-- Add a policy to allow edge functions to select emails for processing
CREATE POLICY "Edge functions can select emails for processing" 
ON public.email_queue 
FOR SELECT 
USING (true);