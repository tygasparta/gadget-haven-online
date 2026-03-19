CREATE TABLE public.whatsapp_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL UNIQUE,
  subscribed_deals boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage subscriptions" ON public.whatsapp_subscriptions FOR ALL USING (true);
CREATE POLICY "Admins can view subscriptions" ON public.whatsapp_subscriptions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));