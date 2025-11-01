# Social Media Link Preview Configuration

## Overview
Your product links now have proper Open Graph and Twitter Card meta tags for beautiful link previews on social media platforms.

## How It Works

### For Social Media Crawlers (Facebook, Twitter, WhatsApp, etc.)
When you share a product link, social media crawlers are served by the `og-meta` edge function which provides:
- Product title
- Product description
- High-resolution product image (1200x630)
- Price information
- Brand information
- Proper meta tags for all platforms

### Share URL Format
The share URL for social media: 
```
https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/og-meta?id={PRODUCT_ID}
```

This URL:
1. Serves proper meta tags to social media crawlers
2. Automatically redirects real users to the actual product page: `https://gadgetgenie.org/product/{PRODUCT_ID}`

## Testing Link Previews

### Facebook
1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your product share URL
3. Click "Debug" to see how Facebook will display your link
4. Click "Scrape Again" if you've made changes

### Twitter
1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your product URL
3. Preview how it will appear on Twitter

### WhatsApp
WhatsApp uses Open Graph tags automatically. Simply share the link in a chat to see the preview.

### LinkedIn
LinkedIn also uses Open Graph tags. Paste your link in a post to see the preview.

## Image Requirements

For best results, product images should:
- Be at least 1200x630 pixels
- Be in JPEG or PNG format
- Have a clear, high-quality photo of the product
- Be publicly accessible (no authentication required)

## Supported Image Sources

The system automatically handles images from:
1. **Supabase Storage**: Images in storage buckets
2. **Public Folder**: Images in `/public/lovable-uploads/`
3. **External URLs**: Direct image URLs from CDNs

## Troubleshooting

### Link preview not showing?
1. Check if the product image URL is publicly accessible
2. Wait a few minutes - social media platforms cache previews
3. Use the debugging tools above to force refresh
4. Ensure the product exists in your database

### Wrong image showing?
1. Clear the social media platform's cache using their debugger tools
2. Verify the product's main image is correctly set
3. Check that image URLs are absolute (not relative)

### Preview shows old information?
Social media platforms cache link previews. Use their debugging tools (linked above) to force a refresh:
- Facebook: Click "Scrape Again"
- Twitter: Re-validate the card
- LinkedIn: Clear cache in LinkedIn Post Inspector

## Meta Tags Included

### Open Graph (Facebook, WhatsApp, LinkedIn)
- `og:type`: product
- `og:title`: Product name
- `og:description`: Product description
- `og:image`: Product image (1200x630)
- `og:url`: Canonical product URL
- `og:site_name`: GadgetGenie
- `product:price:amount`: Price
- `product:price:currency`: USD
- `product:brand`: Brand name

### Twitter Cards
- `twitter:card`: summary_large_image
- `twitter:title`: Product name
- `twitter:description`: Product description
- `twitter:image`: Product image

## Production Domain

All product links and images are configured for your production domain:
**https://gadgetgenie.org**

Make sure this domain is properly configured and pointing to your Lovable app.
