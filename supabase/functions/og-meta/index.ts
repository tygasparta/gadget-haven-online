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
    const productId = url.searchParams.get('id')
    
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

    const imageUrl = getAbsoluteImageUrl(product.image)
    const productUrl = `${siteUrl}/product/${productId}`
    const description = product.description || `${product.name} - Available for just $${product.price}. ${product.brand ? `By ${product.brand}` : ''}`

    // Generate HTML with proper meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${product.name} - GadgetGenie</title>
    <meta name="title" content="${product.name} - GadgetGenie">
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="product">
    <meta property="og:url" content="${productUrl}">
    <meta property="og:title" content="${product.name} - GadgetGenie">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${product.name}">
    <meta property="og:site_name" content="GadgetGenie">
    <meta property="product:price:amount" content="${product.price}">
    <meta property="product:price:currency" content="USD">
    ${product.brand ? `<meta property="product:brand" content="${product.brand}">` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${productUrl}">
    <meta name="twitter:title" content="${product.name} - GadgetGenie">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:image:alt" content="${product.name}">
    
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
        <div style="text-align: center;">
            <h1>${product.name}</h1>
            <p>$${product.price}</p>
            <a href="${productUrl}">View product</a>
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
