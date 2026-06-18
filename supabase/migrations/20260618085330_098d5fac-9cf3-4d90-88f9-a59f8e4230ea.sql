
-- email_queue: replace spoofable current_setting role check with auth.jwt()
DROP POLICY IF EXISTS "System can process pending emails" ON public.email_queue;
CREATE POLICY "System can process pending emails" ON public.email_queue
  FOR SELECT USING (
    (auth.jwt() ->> 'role') = 'service_role'
  );

DROP POLICY IF EXISTS "System can update email processing status" ON public.email_queue;
CREATE POLICY "System can update email processing status" ON public.email_queue
  FOR UPDATE USING (
    (auth.jwt() ->> 'role') = 'service_role'
  );

-- notifications: allow users to delete their own, and admins to manage all
CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
