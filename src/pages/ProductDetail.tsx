import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useProduct } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  const productId = id ? parseInt(id, 10) : 0;
  const { data: product, isLoading, error } = useProduct(productId);
  const isInWishlist = wishlistItems?.some(item => item.product_id === productId) || false;

  // Enhanced brand logos mapping with the new logos
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
    }
  }, [product]);

  const loadGalleryImages = async () => {
    if (!product) return;
    
    try {
      // Load gallery images
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
    
    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
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
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const getBrandLogo = (brandName: string | null) => {
    if (!brandName) return null;
    return brandLogos[brandName] || null;
  };

  // Share functionality
  const getShareText = () => {
    return `Check out this amazing product: ${product?.name} - Only $${product?.price}!`;
  };

  const getAbsoluteImageUrl = (imageUrl: string) => {
    if (!imageUrl) return 'https://gadgetgenie.org/favicon.png';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Always use production domain for social media sharing
    const domain = 'https://gadgetgenie.org';
    
    // If it's a Supabase storage URL
    if (imageUrl.includes('/storage/v1/object/public/')) {
      return `https://ktpxqjyfguxckdzlqwai.supabase.co${imageUrl}`;
    }
    
    // If it's a public folder or lovable-uploads path
    return `${domain}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const getShareUrl = () => {
    // Use the og-meta edge function URL for social sharing - it serves proper meta tags to crawlers
    // and automatically redirects real users to the actual product page
    return `https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/og-meta?id=${id}`;
  };
  
  const getProductUrl = () => {
    return `https://gadgetgenie.org/product/${id}`;
  };

  const handleShare = async (platform: string) => {
    const url = getShareUrl(); // Use the SEO-friendly URL
    const text = getShareText();
    const imageUrl = getAbsoluteImageUrl(product?.image || galleryImages[0]);
    
    switch (platform) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: product?.name,
              text: text,
              url: url,
              files: imageUrl ? [await fetch(imageUrl).then(r => r.blob()).then(blob => new File([blob], "product.jpg", { type: "image/jpeg" }))].filter(Boolean) : undefined
            });
            toast.success('Shared successfully!');
          } catch (error) {
            console.log('Share cancelled');
          }
        } else {
          handleShare('copy');
        }
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
          setShowShareModal(false);
        } catch (error) {
          toast.error('Failed to copy link');
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{product.name} - GadgetGenie</title>
        <meta name="description" content={product.description || `${product.name} - Available for just $${product.price}. ${product.brand ? `By ${product.brand}` : ''}`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={getProductUrl()} />
        
        {/* Open Graph / Facebook */}
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
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - GadgetGenie`} />
        <meta name="twitter:description" content={product.description || `${product.name} - Available for just $${product.price}. ${product.brand ? `By ${product.brand}` : ''}`} />
        <meta name="twitter:image" content={getAbsoluteImageUrl(product.image)} />
      </Helmet>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden relative group">
              <img
                src={galleryImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                }}
              />
              
              {galleryImages.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Thumbnail strip */}
            {galleryImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {galleryImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-2 rounded-full border-2 border-gray-300 hover:border-blue-300 hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className={`p-2 rounded-full border-2 transition-colors ${
                      isInWishlist 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : 'border-gray-300 hover:border-red-300 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              {product.brand && (
                <div className="flex items-center gap-2 mb-4">
                  {getBrandLogo(product.brand) && (
                    <img 
                      src={getBrandLogo(product.brand)!} 
                      alt={product.brand}
                      className="h-6 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="text-lg text-gray-600">by {product.brand}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={product.is_featured ? 'default' : 'secondary'}>
                  {product.is_featured ? 'Featured' : 'Standard'}
                </Badge>
                {product.is_flash_sale && (
                  <Badge className="bg-red-500">Flash Sale</Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                {product.original_price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${product.original_price}</span>
                    <Badge className="bg-green-500">{discountPercentage}% OFF</Badge>
                  </>
                )}
              </div>
              {product.original_price && (
                <p className="text-green-600">You save ${product.original_price - product.price}</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Key Specifications - Prominently Displayed */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                  Key Specifications
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.specifications.slice(0, 6).map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <span className="font-medium text-gray-700 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {spec.key}
                      </span>
                      <span className="text-gray-600 font-semibold">{spec.value}</span>
                    </div>
                  ))}
                  {product.specifications.length > 6 && (
                    <div className="text-center py-2">
                      <span className="text-sm text-gray-500 italic">
                        +{product.specifications.length - 6} more specifications below
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-gray-600">1 year guarantee</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-600">30 day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Product Details Section */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg border-b border-gray-200 pb-2">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Brand</span>
                  <div className="flex items-center gap-2">
                    {getBrandLogo(product.brand) && (
                      <img 
                        src={getBrandLogo(product.brand)!} 
                        alt={product.brand}
                        className="h-5 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="font-medium">{product.brand || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{product.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Stock</span>
                  <span className="font-medium text-green-600">{product.stock} units</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">{product.rating}/5 ⭐</span>
                </div>
              </div>
            </div>
            
            {/* Complete Technical Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 text-lg border-b border-gray-200 pb-2">Complete Specifications</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                      <span className="text-gray-700 font-medium">{spec.key}</span>
                      <span className="font-semibold text-gray-800">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-lg border-b border-gray-200 pb-2">Available Colors</h3>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: color.hex_code }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* What's in the Box */}
          {product.whats_in_box && product.whats_in_box.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-lg border-b border-gray-200 pb-2">What's in the Box</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.whats_in_box.map((item, index) => (
                  <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-lg border-b border-gray-200 pb-2">Product Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share this product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Native Share (Mobile) */}
              {navigator.share && (
                <button
                  onClick={() => handleShare('native')}
                  className="w-full flex items-center justify-center space-x-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share via device</span>
                </button>
              )}
              
              {/* Copy Link */}
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5" />
                <span>Copy link</span>
              </button>
              
              {/* Social Media Options */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Facebook className="w-6 h-6 mb-1" />
                  <span className="text-xs">Facebook</span>
                </button>
                
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center justify-center p-4 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <Twitter className="w-6 h-6 mb-1" />
                  <span className="text-xs">Twitter</span>
                </button>
                
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center justify-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">WhatsApp</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <p className="text-sm font-medium">{getShareText()}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
