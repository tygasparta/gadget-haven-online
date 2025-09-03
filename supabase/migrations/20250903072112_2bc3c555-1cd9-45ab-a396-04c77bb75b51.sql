-- Create WhatsApp conversations table
CREATE TABLE public.whatsapp_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'blocked')),
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create WhatsApp messages table
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'bot', 'admin')),
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'interactive', 'image', 'document')),
  content JSONB NOT NULL,
  message_id TEXT, -- WhatsApp message ID
  delivered BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bot settings table
CREATE TABLE public.bot_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Admins can manage conversations" ON public.whatsapp_conversations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage conversations" ON public.whatsapp_conversations
  FOR ALL USING (true);

-- RLS Policies for messages
CREATE POLICY "Admins can view messages" ON public.whatsapp_messages
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage messages" ON public.whatsapp_messages
  FOR ALL USING (true);

-- RLS Policies for bot settings
CREATE POLICY "Admins can manage bot settings" ON public.bot_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_whatsapp_conversations_phone ON public.whatsapp_conversations(phone_number);
CREATE INDEX idx_whatsapp_conversations_status ON public.whatsapp_conversations(status);
CREATE INDEX idx_whatsapp_conversations_last_message ON public.whatsapp_conversations(last_message_at DESC);
CREATE INDEX idx_whatsapp_messages_conversation ON public.whatsapp_messages(conversation_id);
CREATE INDEX idx_whatsapp_messages_created ON public.whatsapp_messages(created_at DESC);

-- Insert default bot settings
INSERT INTO public.bot_settings (key, value, description) VALUES
('welcome_message', '{"enabled": true, "message": "Hello! 👋 Welcome to Gadget Genie! How can I help you today?"}', 'Welcome message configuration'),
('auto_response', '{"enabled": true, "business_hours": {"start": "09:00", "end": "17:00"}, "after_hours_message": "Thanks for contacting us! We''re currently offline. We''ll get back to you during business hours (9 AM - 5 PM)."}', 'Auto response settings'),
('keywords', '{"product_keywords": ["phone", "laptop", "headphones", "tablet", "watch"], "support_keywords": ["help", "support", "problem", "issue"], "price_keywords": ["price", "cost", "how much"]}', 'Keyword recognition settings');

-- Add trigger for updating timestamps
CREATE TRIGGER update_whatsapp_conversations_updated_at
  BEFORE UPDATE ON public.whatsapp_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_settings_updated_at
  BEFORE UPDATE ON public.bot_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();