# Mobile-first Gadget Genie redesign

## Goal
Rebuild the customer-facing mobile experience as a cohesive shopping app while preserving the existing logo, colours, typography, products, categories, authentication, cart, checkout, wishlist, orders, routes, and backend behavior.

## What will change
- Create one shared mobile system for headers, search, side menu, bottom navigation, product cards, category cards, sheets, spacing, safe areas, loading states, and compact controls.
- Redesign Home, Categories, product listings, Product Details, Cart, Search, Deals, Wishlist, Account, and Orders for 320–430px phones and 768px tablets.
- Use the existing realistic category, campaign, and product photography; product images will use contained framing where cropping would hide the item.
- Keep Add to Cart on Flash Deal cards only; other product cards open the product page.
- Add working sort and filter panels using the existing product fields and preserve current URLs and data queries.
- Add a clean slide-out menu and the fixed five-item navigation: Home, Categories, Deals, Cart, Account.
- Use compact countdowns, restrained discounts, clear stock and pricing, subtle borders/shadows, and professional outline icons.
- Keep desktop behavior intact except where shared components need consistency fixes.

## Installed app experience
- Keep the website free of loading screens.
- Add manifest-only home-screen installation metadata, app icons, theme colour, standalone display, safe-area support, and branded launch presentation for installed use.
- Do not add offline caching or a new service worker.

## Technical details
- Reuse the existing React routes, Supabase hooks, cart context, authentication, checkout, wishlist, and order logic.
- Consolidate repeated mobile UI into focused reusable components without changing public data shapes.
- Remove the remote CSS font import and retain the existing typography through safe system fallbacks.
- Preserve the existing blue-on-white semantic design tokens and avoid dark mode, gradients, decorative animation, emoji, and coloured icon tiles.
- Use responsive images, lazy loading below the fold, fixed image aspect ratios, and existing skeleton components.

## Verification
- Check every requested screen and key shopping action in the live preview.
- Test widths 320, 360, 375, 390, 393, 412, 430, and 768px for overflow, image cropping, text collisions, button fit, and safe-area clearance.
- Confirm the final build, runtime logs, navigation, cart, wishlist, filters, search, account, and orders remain functional.
