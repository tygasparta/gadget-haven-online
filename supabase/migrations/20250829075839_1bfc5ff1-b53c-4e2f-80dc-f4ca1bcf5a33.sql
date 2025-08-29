-- Update the WhatsApp number in the store_info settings
UPDATE public.admin_settings 
SET value = jsonb_set(
  value, 
  '{whatsapp_number}', 
  '"https://wa.me/263719337910"'
)
WHERE key = 'store_info';