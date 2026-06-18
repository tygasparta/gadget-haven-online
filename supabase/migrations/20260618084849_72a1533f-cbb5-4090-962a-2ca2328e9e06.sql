
-- Fix overly permissive RLS policies. Backend uses service_role which bypasses RLS.

-- payment_records: remove (order_id IS NULL) branch
DROP POLICY IF EXISTS "Users can view their own payment records" ON public.payment_records;
CREATE POLICY "Users can view their own payment records" ON public.payment_records
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = payment_records.order_id AND orders.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create payment records for their orders" ON public.payment_records;
CREATE POLICY "Users can create payment records for their orders" ON public.payment_records
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = payment_records.order_id AND orders.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "System can update payment records" ON public.payment_records;

-- orders: drop open update policy
DROP POLICY IF EXISTS "System can update orders" ON public.orders;

-- email_queue: restrict inserts to service_role (bypasses RLS) - drop open policy
DROP POLICY IF EXISTS "Edge functions can insert emails" ON public.email_queue;

-- notifications: drop open insert; service_role and trigger SECURITY DEFINER bypass RLS
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- email_templates: restrict public read
DROP POLICY IF EXISTS "System can read email templates" ON public.email_templates;

-- whatsapp_* tables: drop open ALL policies; service_role bypasses RLS
DROP POLICY IF EXISTS "System can manage whatsapp cart items" ON public.whatsapp_cart_items;
DROP POLICY IF EXISTS "System can manage conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "System can manage messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "System can manage subscriptions" ON public.whatsapp_subscriptions;

-- Fix function search_path on functions missing it
ALTER FUNCTION public.create_default_email_preferences() SET search_path = public;
ALTER FUNCTION public.queue_email_notification(uuid, text, text, jsonb) SET search_path = public;
ALTER FUNCTION public.trigger_order_confirmation_email() SET search_path = public;
ALTER FUNCTION public.trigger_order_status_update_email() SET search_path = public;
ALTER FUNCTION public.trigger_welcome_email() SET search_path = public;

-- Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated so they cannot be called via PostgREST RPC.
-- RLS policies invoke them internally regardless of these grants.
REVOKE EXECUTE ON FUNCTION public.queue_email_notification(uuid, text, text, jsonb) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_default_email_preferences() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.trigger_order_confirmation_email() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.trigger_order_status_update_email() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.trigger_welcome_email() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_new_order() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_order_update() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
