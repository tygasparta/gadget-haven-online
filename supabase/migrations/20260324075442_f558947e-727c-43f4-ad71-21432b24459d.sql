
CREATE OR REPLACE FUNCTION public.notify_new_order()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.user_id, 
    'Order Placed Successfully', 
    'Your order #' || NEW.id || ' has been placed successfully. Total: $' || NEW.total_amount,
    'success'
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_order_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

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

  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (NEW.user_id, notification_title, notification_message, notification_type);
  END IF;

  RETURN NEW;
END;
$function$;
