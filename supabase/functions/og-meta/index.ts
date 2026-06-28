import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    // Accept ?id=123 or path-style /og-meta/123
    let productId = url.searchParams.get('id')
    if (!productId) {
      const parts = url.pathname.split('/').filter(Boolean)
      productId = parts[parts.length - 1] || null
      if (productId === 'og-meta') productId = null
    }
    
    if (!productId) {
      return new Response('Product ID required', { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error || !product) {
      return new Response('Product not found', { status: 404 })
    }

    // Get the site URL from environment or use default
    const siteUrl = 'https://gadgetgenie.org'
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const productUrl = `${siteUrl}/product/${productId}`

    // Detect social-media crawlers vs. real users. Real users get a 302
    // straight to the product page; crawlers get static OG HTML.
    const ua = (req.headers.get('user-agent') || '').toLowerCase()
    const isCrawler = /facebookexternalhit|facebot|twitterbot|whatsapp|telegrambot|slackbot|linkedinbot|discordbot|pinterest|redditbot|skypeuripreview|googlebot|bingbot|applebot|embedly|quora link preview|outbrain|vkshare|w3c_validator|yandex|baiduspider/i.test(ua)
    if (!isCrawler) {
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: productUrl },
      })
    }
    
    // Convert image URL to absolute URL
    const getAbsoluteImageUrl = (imageUrl: string) => {
      if (!imageUrl) return `${siteUrl}/favicon.png`
      
      // If already absolute URL, return as is
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl
      }
      
      // If it's a Supabase storage URL (starts with storage path)
      if (imageUrl.includes('/storage/v1/object/public/')) {
        return `${supabaseUrl}${imageUrl}`
      }
      
      // If it's a public folder or lovable-uploads path
      return `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    }

    const rawImageUrl = getAbsoluteImageUrl(product.image)
    // Composed OG image with price tag overlay (1200x630 PNG)
    const imageUrl = `${supabaseUrl}/functions/v1/og-image?id=${productId}`
    const rawDesc = product.description || `${product.name} - Available for just $${product.price}. ${product.brand ? `By ${product.brand}` : ''}`
    const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const title = esc(`${product.name} - GadgetGenie`)
    const description = esc(rawDesc).slice(0, 300)
    const safeImage = esc(imageUrl)
    const safeUrl = esc(productUrl)
    const safeBrand = product.brand ? esc(product.brand) : ''
    const safeName = esc(product.name)
    const safePrice = esc(String(product.price))

    // Generate HTML with proper meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="product">
    <meta property="og:url" content="${safeUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${safeImage}">
    <meta property="og:image:secure_url" content="${safeImage}">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${safeName}">
    <meta property="og:site_name" content="GadgetGenie">
    <meta property="product:price:amount" content="${safePrice}">
    <meta property="product:price:currency" content="USD">
    ${safeBrand ? `<meta property="product:brand" content="${safeBrand}">` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${safeUrl}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${safeImage}">
    <meta name="twitter:image:alt" content="${safeName}">
    
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
        <div style="text-align: center;">
            <h1>${safeName}</h1>
            <p>$${safePrice}</p>
            <a href="${safeUrl}">View product</a>
        </div>
    </div>
</body>
</html>`

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
