-- Create admin_settings table for storing admin configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin settings
CREATE POLICY "Admins can manage admin settings" 
ON public.admin_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.admin_settings (key, value, description) VALUES 
('store_info', '{"name": "Gadget Genie", "description": "Your Ultimate Tech Destination", "contact_email": "info@gadgetgenie.org", "phone_number": "+1 (555) 123-4567", "address": "", "whatsapp_number": "https://wa.me/c/263719337910"}', 'Basic store information and contact details'),
('notification_settings', '{"email_notifications": true, "order_notifications": true, "stock_alerts": true, "low_stock_threshold": 10}', 'Notification preferences for admins'),
('security_settings', '{"two_factor_auth": false, "session_timeout_hours": 24, "require_strong_passwords": true}', 'Security configuration settings'),
('system_settings', '{"auto_backup": true, "backup_frequency": "daily", "maintenance_mode": false}', 'System configuration settings');