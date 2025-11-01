# PayPal Integration Guide

## Overview
This guide explains how to set up and use PayPal payments in your application.

## Required Secrets

You need to add the following secrets in Supabase:

1. **PAYPAL_CLIENT_ID** - Your PayPal Client ID
2. **PAYPAL_CLIENT_SECRET** - Your PayPal Client Secret
3. **PAYPAL_MODE** (optional) - Set to 'live' for production or 'sandbox' for testing (defaults to sandbox)

### How to Get PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal account
3. Navigate to "Apps & Credentials"
4. Create a new app or use an existing one
5. Copy the **Client ID** and **Secret**

### Adding Secrets to Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ktpxqjyfguxckdzlqwai/settings/functions
2. Navigate to Edge Functions → Secrets
3. Add each secret with its value

## Webhook Configuration

Your PayPal webhook URL is:
```
https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/paypal-webhook
```

### Setting Up Webhooks in PayPal

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Navigate to "Apps & Credentials"
3. Select your app
4. Scroll down to "Webhooks"
5. Click "Add Webhook"
6. Enter the webhook URL: `https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/paypal-webhook`
7. Select the following event types:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.DECLINED`
   - `PAYMENT.CAPTURE.REFUNDED`

## Edge Functions

Three edge functions have been created:

### 1. paypal-create-order
Creates a new PayPal order and returns an approval URL for the user to complete payment.

### 2. paypal-capture-order
Captures the payment after the user approves it on PayPal.

### 3. paypal-webhook
Handles webhook events from PayPal to update order status automatically.

## Testing

### Sandbox Testing

1. Set `PAYPAL_MODE` to 'sandbox' (or leave it unset as it defaults to sandbox)
2. Use PayPal sandbox accounts for testing:
   - Create test accounts at [PayPal Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
3. When testing, you'll be redirected to sandbox.paypal.com

### Production

1. Set `PAYPAL_MODE` to 'live'
2. Use real PayPal credentials
3. Users will be redirected to www.paypal.com

## Payment Flow

1. User selects PayPal as payment method during checkout
2. Order is created in the database with status 'pending'
3. PayPal order is created via `paypal-create-order` edge function
4. User is redirected to PayPal to approve payment
5. After approval, user returns to your site
6. Payment is captured via `paypal-capture-order` edge function
7. Order status is updated to 'confirmed' and payment_status to 'paid'
8. Webhooks handle any additional status updates

## Logs and Debugging

View edge function logs at:
- Create Order: https://supabase.com/dashboard/project/ktpxqjyfguxckdzlqwai/functions/paypal-create-order/logs
- Capture Order: https://supabase.com/dashboard/project/ktpxqjyfguxckdzlqwai/functions/paypal-capture-order/logs
- Webhook: https://supabase.com/dashboard/project/ktpxqjyfguxckdzlqwai/functions/paypal-webhook/logs

## Security

- All PayPal credentials are stored securely in Supabase secrets
- Edge functions are configured with `verify_jwt = false` for webhook compatibility
- Payment amounts are validated before processing
- All transactions are logged for audit purposes
