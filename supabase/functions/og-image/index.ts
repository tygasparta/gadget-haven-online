import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'
import { Image, decode } from 'https://deno.land/x/imagescript@1.2.17/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FONT_URL =
  'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Bold.ttf'
let fontCache: Uint8Array | null = null
async function getFont(): Promise<Uint8Array> {
  if (fontCache) return fontCache
  const r = await fetch(FONT_URL)
  fontCache = new Uint8Array(await r.arrayBuffer())
  return fontCache
}

const SITE_URL = 'https://gadgetgenie.org'

function absoluteImage(imageUrl: string, supabaseUrl: string): string {
  if (!imageUrl) return `${SITE_URL}/favicon.png`
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  if (imageUrl.includes('/storage/v1/object/public/')) return `${supabaseUrl}${imageUrl}`
  return `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    let productId = url.searchParams.get('id')
    if (!productId) {
      const parts = url.pathname.split('/').filter(Boolean)
      productId = parts[parts.length - 1] || null
      if (productId === 'og-image') productId = null
    }
    if (!productId) return new Response('Product ID required', { status: 400 })

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '')

    const { data: product, error } = await supabase
      .from('products')
      .select('id,name,price,original_price,image')
      .eq('id', productId)
      .single()

    if (error || !product) return new Response('Product not found', { status: 404 })

    const imageUrl = absoluteImage(product.image, supabaseUrl)
    const imgResp = await fetch(imageUrl)
    if (!imgResp.ok) return new Response('Image fetch failed', { status: 502 })
    const imgBuf = new Uint8Array(await imgResp.arrayBuffer())
    const src = (await decode(imgBuf)) as Image

    const W = 1200, H = 630
    const canvas = new Image(W, H).fill(0xffffffff)

    const ratio = Math.min(W / src.width, H / src.height)
    const w = Math.max(1, Math.round(src.width * ratio))
    const h = Math.max(1, Math.round(src.height * ratio))
    src.resize(w, h)
    canvas.composite(src, Math.round((W - w) / 2), Math.round((H - h) / 2))

    const font = await getFont()
    const priceText = `$${Number(product.price).toFixed(2)}`
    const priceImg = await Image.renderText(font, 48, priceText, 0xffffffff)

    const padX = 20, padY = 12
    const badgeW = priceImg.width + padX * 2
    const badgeH = priceImg.height + padY * 2
    const badge = new Image(badgeW, badgeH).fill(0x0982c3ff) // brand blue (hsl 201 91% 40%)
    const bx = 32
    const by = H - badgeH - 32
    canvas.composite(badge, bx, by)
    canvas.composite(priceImg, bx + padX, by + padY)

    // Optional original price (smaller faded text)
    if (product.original_price && Number(product.original_price) > Number(product.price)) {
      const orig = `was $${Number(product.original_price).toFixed(2)}`
      const origImg = await Image.renderText(font, 24, orig, 0x666666ff)
      canvas.composite(origImg, bx, by - origImg.height - 6)
    }

    const png = await canvas.encode()
    return new Response(png, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (e) {
    console.error('og-image error', e)
    return new Response(`og-image error: ${(e as Error).message}`, { status: 500 })
  }
})
