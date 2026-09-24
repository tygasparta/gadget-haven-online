import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Copy, Facebook, Twitter, MessageCircle, X, PackageCheck, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useProduct } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';
import ProductSpecifications from '@/components/ProductSpecifications';
import ProductColorSelector from '@/components/ProductColorSelector';
import RelatedProducts from '@/components/RelatedProducts';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import RecentlyViewed, { recordProductView } from '@/components/RecentlyViewed';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { mutate: addToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistItems } = useWishlist();

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const productId = id ? parseInt(id, 10) : 0;
  const { data: product, isLoading, error } = useProduct(productId);
  const isInWishlist = wishlistItems?.some(item => item.product_id === productId) || false;

  const brandLogos: { [key: string]: string } = {
    'Apple': 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
    'Samsung': 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png',
    'Google': 'https://logos-world.net/wp-content/uploads/2020/04/Google-Logo.png',
    'OnePlus': 'https://logos-world.net/wp-content/uploads/2020/04/OnePlus-Logo.png',
    'Xiaomi': '/lovable-uploads/13f14634-a87f-479a-9c94-2f51dbc3dff8.png',
    'Huawei': '/lovable-uploads/68b8d5b7-a7be-46cf-ad6f-92731e8b8313.png',
    'Sony': 'https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png',
    'Dell': 'https://logos-world.net/wp-content/uploads/2020/04/Dell-Logo.png',
    'HP': 'https://logos-world.net/wp-content/uploads/2020/04/HP-Logo.png',
    'Lenovo': 'https://logos-world.net/wp-content/uploads/2020/04/Lenovo-Logo.png',
    'Asus': 'https://logos-world.net/wp-content/uploads/2020/04/Asus-Logo.png',
    'Nintendo': 'https://logos-world.net/wp-content/uploads/2020/04/Nintendo-Logo.png',
    'PlayStation': 'https://logos-world.net/wp-content/uploads/2020/04/PlayStation-Logo.png',
    'Xbox': 'https://logos-world.net/wp-content/uploads/2020/04/Xbox-Logo.png',
    'Canon': 'https://logos-world.net/wp-content/uploads/2020/04/Canon-Logo.png',
    'Nikon': 'https://logos-world.net/wp-content/uploads/2020/04/Nikon-Logo.png',
    'Bose': 'https://logos-world.net/wp-content/uploads/2020/04/Bose-Logo.png',
    'JBL': 'https://logos-world.net/wp-content/uploads/2020/04/JBL-Logo.png',
    'Beats': 'https://logos-world.net/wp-content/uploads/2020/04/Beats-Logo.png',
    'Garmin': 'https://logos-world.net/wp-content/uploads/2020/04/Garmin-Logo.png',
    'Fitbit': 'https://logos-world.net/wp-content/uploads/2020/04/Fitbit-Logo.png',
    'DEFY': '/lovable-uploads/ab88f90b-e334-4aab-a573-cbf5ac3bd7a0.png',
    'Hi': '/lovable-uploads/b4327d38-07c3-4648-977f-e881ea91d4fb.png',
    'DOMAX': '/lovable-uploads/eb0219a5-d68a-4b69-8055-172b2f5982d5.png',
    'RE/MAX': '/lovable-uploads/ba315e55-1352-462f-a934-e9ab4ebb1f24.png'
  };

  useEffect(() => {
    if (product) {
      loadGalleryImages();
      recordProductView(productId);
      setSelectedColor(product.colors?.[0]?.name ?? null);
      setQuantity(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const loadGalleryImages = async () => {
    if (!product) return;
    try {
      const { data: galleryData } = await supabase
        .from('product_galleries')
        .select('image_url')
        .eq('product_id', productId)
        .order('display_order');

      const images = galleryData?.map(img => img.image_url) || [];
      if (product.image && !images.includes(product.image)) {
        images.unshift(product.image);
      }
      setGalleryImages(images.length > 0 ? images : [product.image]);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      setGalleryImages([product.image]);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please log in to add items to wishlist');
      navigate('/auth');
      return;
    }
    if (isInWishlist) removeFromWishlist(productId);
    else addToWishlist(productId);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      navigate('/auth');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({ productId });
    }
    toast.success(`${product?.name} added to cart${selectedColor ? ` — ${selectedColor}` : ''}`);
  };

  const getBrandLogo = (brandName: string | null) => (brandName ? brandLogos[brandName] || null : null);

  const getShareText = () => `Check out this amazing product: ${product?.name} - Only $${product?.price}!`;

  const getAbsoluteImageUrl = (imageUrl: string) => {
    if (!imageUrl) return 'https://gadgetgenie.org/favicon.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    if (imageUrl.includes('/storage/v1/object/public/')) {
      return `https://ktpxqjyfguxckdzlqwai.supabase.co${imageUrl}`;
    }
    return `https://gadgetgenie.org${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const getShareUrl = () => `https://gadgetgenie.org/product/${id}`;
  const getProductUrl = () => `https://gadgetgenie.org/product/${id}`;
  const getOgMetaUrl = () => `https://share.gadgetgenie.org/${id}`;

  const handleShare = async (platform: string) => {
    const text = getShareText();
    const ogUrl = getOgMetaUrl();

    switch (platform) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({ title: product?.name, text, url: ogUrl });
            toast.success('Shared successfully!');
          } catch {
            console.log('Share cancelled');
          }
        } else {
          handleShare('copy');
        }
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(ogUrl);
          toast.success('Share link copied to clipboard!');
          setShowShareModal(false);
        } catch {
          toast.error('Failed to copy link');
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(ogUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + ogUrl)}`, '_blank');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square rounded-xl animate-shimmer" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded animate-shimmer" />
              <div className="h-5 w-1/3 rounded animate-shimmer" />
              <div className="h-10 w-1/2 rounded animate-shimmer" />
              <div className="h-32 w-full rounded animate-shimmer" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const stockLabel = product.stock <= 0
    ? { text: 'Out of stock', tone: 'text-destructive', Icon: PackageX }
    : product.stock <= 5
      ? { text: `Only ${product.stock} left`, tone: 'text-warning', Icon: PackageCheck }
      : { text: 'In stock', tone: 'text-success', Icon: PackageCheck };

  return (
    <div className="min-h-screen bg-muted/20">
      <Helmet>
        <title>{product.name} - GadgetGenie</title>
        <meta name="description" content={product.description || `${product.name} - Available for just $${product.price}. ${product.brand ? `By ${product.brand}` : ''}`} />
        <link rel="canonical" href={getProductUrl()} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} - GadgetGenie`} />
        <meta property="og:description" content={product.description || `${product.name} - Available for just $${product.price}. ${product.brand ? `By ${product.brand}` : ''}`} />
        <meta property="og:image" content={getAbsoluteImageUrl(product.image)} />
        <meta property="og:image:secure_url" content={getAbsoluteImageUrl(product.image)} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={product.name} />
        <meta property="og:url" content={getProductUrl()} />
        <meta property="og:site_name" content="GadgetGenie" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="USD" />
        {product.brand && <meta property="product:brand" content={product.brand} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - GadgetGenie`} />
        <meta name="twitter:description" content={product.description || `${product.name} - Available for just $${product.price}. ${product.brand ? `By ${product.brand}` : ''}`} />
        <meta name="twitter:image" content={getAbsoluteImageUrl(product.image)} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image: getAbsoluteImageUrl(product.image),
            description: product.description,
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            offers: {
              '@type': 'Offer',
              url: getProductUrl(),
              priceCurrency: 'USD',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
            aggregateRating: product.reviews > 0 ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviews,
            } : undefined,
          })}
        </script>
      </Helmet>
      <Header />

      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {product.category && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/products?category=${product.category.toLowerCase()}`}>{product.category}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[220px] sm:max-w-none">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery images={galleryImages} alt={product.name} />

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{product.name}</h1>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setShowShareModal(true)}
                    aria-label="Share product"
                    className="p-2 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    aria-label="Toggle wishlist"
                    className={`p-2 rounded-full border transition-colors ${
                      isInWishlist ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border hover:border-destructive/40 hover:text-destructive'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {product.brand && (
                <div className="flex items-center gap-2 mb-3">
                  {getBrandLogo(product.brand) && (
                    <img
                      src={getBrandLogo(product.brand)!}
                      alt={product.brand}
                      className="h-5 w-auto object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <p className="text-muted-foreground">by {product.brand}</p>
                </div>
              )}

              <div className="flex items-center flex-wrap gap-2 mb-4">
                <Badge variant={product.is_featured ? 'default' : 'secondary'}>
                  {product.is_featured ? 'Featured' : 'Standard'}
                </Badge>
                {product.is_flash_sale && <Badge className="bg-destructive text-destructive-foreground">Flash Sale</Badge>}
                {product.category && <Badge variant="outline">{product.category}</Badge>}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-rating fill-current' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
              <span className={`flex items-center gap-1 text-sm font-medium ${stockLabel.tone}`}>
                <stockLabel.Icon className="w-4 h-4" />
                {stockLabel.text}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-primary">${product.price}</span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">${product.original_price}</span>
                    <Badge className="bg-success text-success-foreground">{discountPercentage}% OFF</Badge>
                  </>
                )}
              </div>
              {product.original_price && (
                <p className="text-success text-sm">You save ${product.original_price - product.price}</p>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <ProductColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            )}

            <div className="flex items-center space-x-4">
              <span className="font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted transition-colors" aria-label="Decrease quantity">-</button>
                <span className="px-4 py-2 border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted transition-colors" aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div className="hidden sm:flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="w-7 h-7 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="w-7 h-7 mx-auto text-success mb-2" />
                <p className="text-sm font-medium text-foreground">Warranty</p>
                <p className="text-xs text-muted-foreground">1 year guarantee</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-7 h-7 mx-auto text-warning mb-2" />
                <p className="text-sm font-medium text-foreground">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30 day policy</p>
              </div>
            </div>
          </div>
        </div>

        <FrequentlyBoughtTogether
          mainProduct={{ id: product.id, name: product.name, price: product.price, image: product.image }}
          category={product.category}
        />

        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">Complete Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-base border-b border-border pb-2 text-foreground">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium text-foreground">{product.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">{product.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground">Stock</span>
                  <span className={`font-medium ${stockLabel.tone}`}>{product.stock} units</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium text-foreground">{product.rating}/5 ⭐</span>
                </div>
              </div>
            </div>

            <ProductSpecifications specifications={product.specifications} />
          </div>

          {product.whats_in_box && product.whats_in_box.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-base border-b border-border pb-2 text-foreground">What's in the Box</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.whats_in_box.map((item, index) => (
                  <div key={index} className="flex items-center p-2 bg-success/10 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full mr-3" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-base border-b border-border pb-2 text-foreground">Product Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <RelatedProducts category={product.category} excludeId={product.id} />
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-pb bg-background border-t border-border px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-primary truncate">${product.price}</p>
          <p className={`text-xs ${stockLabel.tone}`}>{stockLabel.text}</p>
        </div>
        <Button onClick={handleAddToCart} disabled={product.stock <= 0} className="bg-primary hover:bg-primary/90 px-6">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Share this product</h3>
              <button onClick={() => setShowShareModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={() => handleShare('native')}
                  className="w-full flex items-center justify-center space-x-3 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share via device</span>
                </button>
              )}

              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-muted hover:bg-muted/70 text-foreground rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5" />
                <span>Copy link</span>
              </button>

              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleShare('facebook')} className="flex flex-col items-center justify-center p-4 bg-[#1877F2] hover:opacity-90 text-white rounded-lg transition-opacity">
                  <Facebook className="w-6 h-6 mb-1" />
                  <span className="text-xs">Facebook</span>
                </button>
                <button onClick={() => handleShare('twitter')} className="flex flex-col items-center justify-center p-4 bg-[#1DA1F2] hover:opacity-90 text-white rounded-lg transition-opacity">
                  <Twitter className="w-6 h-6 mb-1" />
                  <span className="text-xs">Twitter</span>
                </button>
                <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center justify-center p-4 bg-success hover:opacity-90 text-success-foreground rounded-lg transition-opacity">
                  <MessageCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/40 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Preview:</p>
              <p className="text-sm font-medium text-foreground">{getShareText()}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
