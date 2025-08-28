-- Fix critical security issue: Remove overly permissive email queue access
-- This prevents unauthorized access to customer email addresses and personal data

-- Drop the dangerous policy that allows anyone to read all emails
DROP POLICY IF EXISTS "Edge functions can select emails for processing" ON public.email_queue;

-- Drop the overly permissive update policy 
DROP POLICY IF EXISTS "Edge functions can update email status" ON public.email_queue;

-- Create a more secure policy for system processes (edge functions)
-- This policy only allows reading emails when called from edge functions with proper service role
CREATE POLICY "System can process pending emails"
ON public.email_queue
FOR SELECT
USING (
  -- Only allow system/service role access for processing
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  OR 
  -- Or authenticated users can only see their own emails
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Create secure policy for system updates (edge functions with service role)
CREATE POLICY "System can update email processing status" 
ON public.email_queue
FOR UPDATE
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- Ensure edge functions can still insert emails (this policy was already restrictive enough)
-- "Edge functions can insert emails" policy remains as-is since it only allows INSERT, not READ