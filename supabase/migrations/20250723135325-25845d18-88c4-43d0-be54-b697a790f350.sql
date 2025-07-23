
-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email queue table
CREATE TABLE public.email_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_key TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email preferences table
CREATE TABLE public.email_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_confirmations BOOLEAN NOT NULL DEFAULT true,
  order_status_updates BOOLEAN NOT NULL DEFAULT true,
  shipping_notifications BOOLEAN NOT NULL DEFAULT true,
  promotional_emails BOOLEAN NOT NULL DEFAULT true,
  newsletter BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for email_templates
CREATE POLICY "Admins can manage email templates" 
  ON public.email_templates 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can read email templates" 
  ON public.email_templates 
  FOR SELECT 
  USING (true);

-- Create policies for email_queue
CREATE POLICY "Admins can view all email queue" 
  ON public.email_queue 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own email queue" 
  ON public.email_queue 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage email queue" 
  ON public.email_queue 
  FOR ALL 
  USING (true);

-- Create policies for email_preferences
CREATE POLICY "Users can manage their own email preferences" 
  ON public.email_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_email_queue_status ON public.email_queue(status);
CREATE INDEX idx_email_queue_user_id ON public.email_queue(user_id);
CREATE INDEX idx_email_queue_created_at ON public.email_queue(created_at);
CREATE INDEX idx_email_templates_key ON public.email_templates(template_key);

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_email_templates_updated_at 
  BEFORE UPDATE ON public.email_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_queue_updated_at 
  BEFORE UPDATE ON public.email_queue 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_preferences_updated_at 
  BEFORE UPDATE ON public.email_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (template_key, subject, html_content, text_content) VALUES
('order_confirmation', 'Order Confirmation - Order #{{order_id}}', 
 '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2563eb; margin: 0;">Order Confirmation</h1>
        <p style="color: #666; margin: 10px 0 0 0;">Thank you for your order!</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #374151; margin-top: 0;">Order Details</h2>
        <p><strong>Order ID:</strong> #{{order_id}}</p>
        <p><strong>Total Amount:</strong> ${{total_amount}}</p>
        <p><strong>Status:</strong> {{status}}</p>
        <p><strong>Order Date:</strong> {{order_date}}</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0;">Items Ordered</h3>
        {{#each items}}
        <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0; display: flex; justify-content: space-between;">
            <div>
                <strong>{{name}}</strong><br>
                <small style="color: #666;">Quantity: {{quantity}}</small>
            </div>
            <div style="text-align: right;">
                <strong>${{price}}</strong>
            </div>
        </div>
        {{/each}}
    </div>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="color: #666; margin: 0;">We will send you updates about your order status.</p>
        <p style="color: #666; margin: 10px 0 0 0;">Thank you for shopping with Gadget Genie!</p>
    </div>
</body>
</html>',
'Order Confirmation - Order #{{order_id}}

Thank you for your order!

Order Details:
- Order ID: #{{order_id}}
- Total Amount: ${{total_amount}}
- Status: {{status}}
- Order Date: {{order_date}}

We will send you updates about your order status.
Thank you for shopping with Gadget Genie!'),

('order_status_update', 'Order Status Update - Order #{{order_id}}',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2563eb; margin: 0;">Order Status Update</h1>
        <p style="color: #666; margin: 10px 0 0 0;">Your order status has been updated</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #374151; margin-top: 0;">Order #{{order_id}}</h2>
        <p><strong>New Status:</strong> <span style="color: #059669;">{{new_status}}</span></p>
        <p><strong>Previous Status:</strong> {{previous_status}}</p>
        <p><strong>Updated:</strong> {{updated_date}}</p>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="color: #666; margin: 0;">Track your order anytime in your account dashboard.</p>
        <p style="color: #666; margin: 10px 0 0 0;">Thank you for shopping with Gadget Genie!</p>
    </div>
</body>
</html>',
'Order Status Update - Order #{{order_id}}

Your order status has been updated

Order #{{order_id}}
- New Status: {{new_status}}
- Previous Status: {{previous_status}}
- Updated: {{updated_date}}

Track your order anytime in your account dashboard.
Thank you for shopping with Gadget Genie!'),

('welcome_email', 'Welcome to Gadget Genie!',
'<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Gadget Genie</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #2563eb; color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <h1 style="margin: 0;">Welcome to Gadget Genie!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Hi {{user_name}}, thanks for joining us!</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #374151; margin-top: 0;">Get Started</h2>
        <p>Explore our amazing collection of gadgets and electronics. We have everything from the latest smartphones to cutting-edge accessories.</p>
        <p>As a new member, you can enjoy:</p>
        <ul style="color: #374151;">
            <li>Free shipping on orders over $50</li>
            <li>Exclusive member deals</li>
            <li>Early access to new products</li>
            <li>24/7 customer support</li>
        </ul>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="color: #666; margin: 0;">Happy shopping!</p>
        <p style="color: #666; margin: 10px 0 0 0;">The Gadget Genie Team</p>
    </div>
</body>
</html>',
'Welcome to Gadget Genie!

Hi {{user_name}}, thanks for joining us!

Get Started:
Explore our amazing collection of gadgets and electronics. We have everything from the latest smartphones to cutting-edge accessories.

As a new member, you can enjoy:
- Free shipping on orders over $50
- Exclusive member deals
- Early access to new products
- 24/7 customer support

Happy shopping!
The Gadget Genie Team');

-- Function to create default email preferences for new users
CREATE OR REPLACE FUNCTION create_default_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default email preferences when a user profile is created
CREATE TRIGGER create_email_preferences_on_profile_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_email_preferences();

-- Function to queue email notifications
CREATE OR REPLACE FUNCTION queue_email_notification(
  p_user_id UUID,
  p_template_key TEXT,
  p_recipient_email TEXT,
  p_variables JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_template RECORD;
  v_subject TEXT;
  v_html_content TEXT;
  v_text_content TEXT;
  v_email_id UUID;
  v_preferences RECORD;
BEGIN
  -- Get email preferences for the user
  SELECT * INTO v_preferences
  FROM public.email_preferences
  WHERE user_id = p_user_id;
  
  -- Check if user wants this type of email
  IF v_preferences IS NULL THEN
    -- Create default preferences if they don't exist
    INSERT INTO public.email_preferences (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Get the preferences again
    SELECT * INTO v_preferences
    FROM public.email_preferences
    WHERE user_id = p_user_id;
  END IF;
  
  -- Check preferences based on template type
  IF p_template_key = 'order_confirmation' AND NOT v_preferences.order_confirmations THEN
    RETURN NULL;
  END IF;
  
  IF p_template_key = 'order_status_update' AND NOT v_preferences.order_status_updates THEN
    RETURN NULL;
  END IF;
  
  -- Get the email template
  SELECT * INTO v_template
  FROM public.email_templates
  WHERE template_key = p_template_key AND is_active = true;
  
  IF v_template IS NULL THEN
    RAISE EXCEPTION 'Email template not found: %', p_template_key;
  END IF;
  
  -- Simple template variable replacement (basic implementation)
  v_subject := v_template.subject;
  v_html_content := v_template.html_content;
  v_text_content := v_template.text_content;
  
  -- Insert into email queue
  INSERT INTO public.email_queue (
    user_id, template_key, recipient_email, subject, 
    html_content, text_content, variables
  )
  VALUES (
    p_user_id, p_template_key, p_recipient_email, v_subject,
    v_html_content, v_text_content, p_variables
  )
  RETURNING id INTO v_email_id;
  
  RETURN v_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger email notifications on order creation
CREATE OR REPLACE FUNCTION trigger_order_confirmation_email()
RETURNS TRIGGER AS $$
DECLARE
  v_user_email TEXT;
  v_variables JSONB;
BEGIN
  -- Get user email from auth.users (we'll need to join with profiles)
  SELECT email INTO v_user_email
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  IF v_user_email IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Prepare variables for email template
  v_variables := jsonb_build_object(
    'order_id', NEW.id,
    'total_amount', NEW.total_amount,
    'status', NEW.status,
    'order_date', NEW.created_at
  );
  
  -- Queue the email
  PERFORM queue_email_notification(
    NEW.user_id,
    'order_confirmation',
    v_user_email,
    v_variables
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger email notifications on order status update
CREATE OR REPLACE FUNCTION trigger_order_status_update_email()
RETURNS TRIGGER AS $$
DECLARE
  v_user_email TEXT;
  v_variables JSONB;
BEGIN
  -- Only send email if status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get user email
  SELECT email INTO v_user_email
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  IF v_user_email IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Prepare variables for email template
  v_variables := jsonb_build_object(
    'order_id', NEW.id,
    'new_status', NEW.status,
    'previous_status', OLD.status,
    'updated_date', NEW.updated_at
  );
  
  -- Queue the email
  PERFORM queue_email_notification(
    NEW.user_id,
    'order_status_update',
    v_user_email,
    v_variables
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger welcome email on user registration
CREATE OR REPLACE FUNCTION trigger_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  v_variables JSONB;
BEGIN
  -- Prepare variables for email template
  v_variables := jsonb_build_object(
    'user_name', COALESCE(NEW.full_name, 'Valued Customer')
  );
  
  -- Queue the welcome email
  PERFORM queue_email_notification(
    NEW.id,
    'welcome_email',
    NEW.email,
    v_variables
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for email notifications
CREATE TRIGGER order_confirmation_email_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_order_confirmation_email();

CREATE TRIGGER order_status_update_email_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_order_status_update_email();

CREATE TRIGGER welcome_email_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_welcome_email();
