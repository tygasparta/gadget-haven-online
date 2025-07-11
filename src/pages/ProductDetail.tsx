import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';
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
  
  const [product, setProduct] = useState<Product | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const productId = id ? parseInt(id, 10) : 0;
  const isInWishlist = wishlistItems?.some(item => item.product_id === productId) || false;

  // Brand logos mapping
  const brandLogos: { [key: string]: string } = {
    'Apple': 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
    'Samsung': 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png',
    'Google': 'https://logos-world.net/wp-content/uploads/2020/04/Google-Logo.png',
    'OnePlus': 'https://logos-world.net/wp-content/uploads/2020/04/OnePlus-Logo.png',
    'Xiaomi': 'https://logos-world.net/wp-content/uploads/2020/04/Xiaomi-Logo.png',
    'Huawei': 'https://logos-world.net/wp-content/uploads/2020/04/Huawei-Logo.png',
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
    'Fitbit': 'https://logos-world.net/wp-content/uploads/2020/04/Fitbit-Logo.png'
  };

  useEffect(() => {
    if (id && !isNaN(productId)) {
      loadProduct();
    }
  }, [id, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      // Fetch product details
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      // Cast the raw data to Product type with proper type handling
      const processedProduct: Product = {
        ...productData,
        colors: productData.colors as Array<{name: string, hex_code: string}> | null,
        specifications: (productData.specifications as Array<{key: string, value: string}>) || []
      };

      setProduct(processedProduct);

      // Load gallery images
      const { data: galleryData } = await supabase
        .from('product_galleries')
        .select('image_url')
        .eq('product_id', productId)
        .order('display_order');

      const images = galleryData?.map(img => img.image_url) || [];
      if (productData.image && !images.includes(productData.image)) {
        images.unshift(productData.image);
      }
      
      setGalleryImages(images.length > 0 ? images : [productData.image]);
      
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
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

            {/* Product Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-700">{spec.key}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
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

        {/* Product Details */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand</span>
                  <div className="flex items-center gap-2">
                    {getBrandLogo(product.brand) && (
                      <img 
                        src={getBrandLogo(product.brand)!} 
                        alt={product.brand}
                        className="h-4 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="font-medium">{product.brand || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{product.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">{product.rating}/5</span>
                </div>
              </div>
            </div>
            
            {/* Additional Product Specifications in Details */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Technical Specifications</h3>
                <div className="space-y-2">
                  {product.specifications.slice(0, 8).map((spec, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{spec.key}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                  {product.specifications.length > 8 && (
                    <p className="text-sm text-gray-500 italic">
                      And {product.specifications.length - 8} more specifications...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color.hex_code }}
                    ></div>
                    <span className="text-sm text-gray-600">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* What's in the Box */}
          {product.whats_in_box && product.whats_in_box.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">What's in the Box</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.whats_in_box.map((item, index) => (
                  <li key={index} className="text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
