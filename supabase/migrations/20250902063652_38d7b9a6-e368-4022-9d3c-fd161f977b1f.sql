-- Create table for WhatsApp conversations
CREATE TABLE public.whatsapp_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  user_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create table for WhatsApp messages
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  message_id TEXT, -- WhatsApp message ID
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'bot')),
  message_type TEXT NOT NULL DEFAULT 'text',
  content JSONB NOT NULL,
  delivered BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for bot settings
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

-- Policies for whatsapp_conversations
CREATE POLICY "Admins can manage conversations" 
ON public.whatsapp_conversations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage conversations" 
ON public.whatsapp_conversations 
FOR ALL 
USING (true);

-- Policies for whatsapp_messages
CREATE POLICY "Admins can view messages" 
ON public.whatsapp_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage messages" 
ON public.whatsapp_messages 
FOR ALL 
USING (true);

-- Policies for bot_settings
CREATE POLICY "Admins can manage bot settings" 
ON public.bot_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_conversations_phone ON public.whatsapp_conversations(phone_number);
CREATE INDEX idx_conversations_status ON public.whatsapp_conversations(status);
CREATE INDEX idx_messages_conversation ON public.whatsapp_messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.whatsapp_messages(created_at);

-- Add trigger for updating timestamps
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.whatsapp_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_settings_updated_at
BEFORE UPDATE ON public.bot_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default bot settings
INSERT INTO public.bot_settings (key, value, description) VALUES
('welcome_message', '{"text": "👋 Welcome to GadgetGenie! How can I help you today?\n\n📱 Type *products* to browse our catalog\n🔍 Type *search [product name]* to find specific items\n💬 Or just tell me what you\'re looking for!"}', 'Welcome message sent to new users'),
('auto_responses', '{"enabled": true, "business_hours": {"start": "09:00", "end": "18:00", "timezone": "UTC"}}', 'Auto response settings'),
('menu_options', '{"main_menu": [{"id": "products", "title": "📱 View Products", "description": "Browse our latest gadgets"}, {"id": "search", "title": "🔍 Search Products", "description": "Find specific items"}, {"id": "orders", "title": "📦 My Orders", "description": "Track your orders"}, {"id": "support", "title": "💬 Support", "description": "Get help from our team"}]}', 'Interactive menu options');