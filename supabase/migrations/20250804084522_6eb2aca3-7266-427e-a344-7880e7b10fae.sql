
-- Create triggers for order notifications and emails
CREATE OR REPLACE FUNCTION notify_order_update()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Determine notification content based on status change
  CASE NEW.status
    WHEN 'confirmed' THEN
      notification_title := 'Order Confirmed';
      notification_message := 'Your order #' || NEW.id || ' has been confirmed and is being processed.';
      notification_type := 'success';
    WHEN 'processing' THEN
      notification_title := 'Order Processing';
      notification_message := 'Your order #' || NEW.id || ' is now being processed.';
      notification_type := 'info';
    WHEN 'shipped' THEN
      notification_title := 'Order Shipped';
      notification_message := 'Great news! Your order #' || NEW.id || ' has been shipped and is on its way.';
      notification_type := 'success';
    WHEN 'delivered' THEN
      notification_title := 'Order Delivered';
      notification_message := 'Your order #' || NEW.id || ' has been successfully delivered.';
      notification_type := 'success';
    WHEN 'cancelled' THEN
      notification_title := 'Order Cancelled';
      notification_message := 'Your order #' || NEW.id || ' has been cancelled.';
      notification_type := 'warning';
    ELSE
      notification_title := 'Order Update';
      notification_message := 'Your order #' || NEW.id || ' status has been updated to ' || NEW.status || '.';
      notification_type := 'info';
  END CASE;

  -- Only create notification if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Insert notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (NEW.user_id, notification_title, notification_message, notification_type);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order updates
DROP TRIGGER IF EXISTS order_update_notification_trigger ON orders;
CREATE TRIGGER order_update_notification_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_update();

-- Create function for new order notifications
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for new order
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.user_id, 
    'Order Placed Successfully', 
    'Your order #' || NEW.id || ' has been placed successfully. Total: $' || NEW.total_amount,
    'success'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS new_order_notification_trigger ON orders;
CREATE TRIGGER new_order_notification_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order();

-- Insert default email templates if they don't exist
INSERT INTO email_templates (template_key, subject, html_content, text_content, is_active) 
VALUES 
  ('welcome_email', 'Welcome to Gadget Genie!', 
   '<h1>Welcome {user_name}!</h1><p>Thank you for joining Gadget Genie. We''re excited to have you on board!</p>', 
   'Welcome {user_name}! Thank you for joining Gadget Genie. We''re excited to have you on board!', 
   true),
  ('order_confirmation', 'Order Confirmation - #{order_id}', 
   '<h1>Order Confirmed!</h1><p>Your order #{order_id} has been confirmed.</p><p>Total: ${total_amount}</p><p>Order Date: {order_date}</p>', 
   'Order Confirmed! Your order #{order_id} has been confirmed. Total: ${total_amount}. Order Date: {order_date}', 
   true),
  ('order_status_update', 'Order Update - #{order_id}', 
   '<h1>Order Status Update</h1><p>Your order #{order_id} status has been updated to: {new_status}</p><p>Updated on: {updated_date}</p>', 
   'Order Status Update: Your order #{order_id} status has been updated to: {new_status}. Updated on: {updated_date}', 
   true)
ON CONFLICT (template_key) DO NOTHING;
