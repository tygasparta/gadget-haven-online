# Social Media Sharing - Testing & Debugging

## What Was Fixed

✅ **Absolute URLs**: All product images now use full `https://gadgetgenie.org` URLs instead of relative paths
✅ **Proper Meta Tags**: Added comprehensive Open Graph and Twitter Card meta tags
✅ **Edge Function**: Created `og-meta` edge function for crawler-specific rendering (optional advanced feature)

## Current Solution

The app now uses absolute URLs (https://gadgetgenie.org) for all product images in social media previews. This ensures platforms like Facebook, WhatsApp, and Twitter can properly fetch and display product images.

## Testing Your Links

### 1. **Facebook Sharing Debugger**
- Go to: https://developers.facebook.com/tools/debug/
- Enter your product URL (e.g., `https://gadgetgenie.org/product/247`)
- Click **Debug** to see what Facebook sees
- Click **Scrape Again** to clear Facebook's cache and fetch fresh data

### 2. **Twitter Card Validator**
- Go to: https://cards-dev.twitter.com/validator
- Enter your product URL
- Click **Preview card** to see the preview

### 3. **LinkedIn Post Inspector**
- Go to: https://www.linkedin.com/post-inspector/
- Enter your product URL
- Click **Inspect**

### 4. **WhatsApp**
WhatsApp doesn't have a debugging tool, but it reads Open Graph tags. If WhatsApp doesn't show a preview:
- Clear the chat where you sent the link
- Wait 5-10 minutes (WhatsApp caches aggressively)
- Send the link again in a new chat

## Important Notes

### Cache Issues
Social media platforms cache link previews for 24-48 hours. If you don't see your image immediately:
1. Use the debugging tools above to force a refresh
2. Wait a few minutes and try again
3. Add a URL parameter like `?v=2` to create a "new" URL that bypasses cache

### Image Requirements
Different platforms have different requirements:
- **Facebook**: Minimum 200x200px, recommended 1200x630px
- **Twitter**: Minimum 300x157px, recommended 1200x675px  
- **WhatsApp**: Minimum 200x200px, recommended 1200x630px
- **All**: Images must be publicly accessible (not behind authentication)

### Testing Checklist
Before sharing on social media, verify:
- [ ] Product has an image set
- [ ] Image is in `/public/lovable-uploads/` (publicly accessible)
- [ ] URL is the production URL (https://gadgetgenie.org)
- [ ] Debug the URL on Facebook/Twitter tools first
- [ ] Clear platform cache if you've shared the link before

## Troubleshooting

**Problem**: Still no image preview
- **Solution**: Check if the image URL is accessible by opening it directly in a browser
- **Solution**: Use Facebook Debugger to see what error message you get
- **Solution**: Verify the image file exists in `/public/lovable-uploads/`

**Problem**: Old image still showing
- **Solution**: Use the debugging tools to force refresh the cache
- **Solution**: Add `?v=1`, `?v=2`, etc. to the URL to bypass cache

**Problem**: Works on Facebook but not WhatsApp
- **Solution**: WhatsApp caches very aggressively - wait 24 hours or use a new chat

## Advanced: Edge Function (Optional)

For even better social media support, you can deploy the `og-meta` edge function:
1. Deploy: `supabase functions deploy og-meta`
2. This creates crawler-specific HTML pages with proper meta tags
3. Only needed if you want server-side rendering for crawlers

## Quick Test

Try these URLs in Facebook Debugger right now:
1. `https://gadgetgenie.org/product/247`
2. Check if the image appears in the preview
3. If not, click "Scrape Again" to refresh
