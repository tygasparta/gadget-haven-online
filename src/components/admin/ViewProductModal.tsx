
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Package, DollarSign, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface ViewProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ product, isOpen, onClose }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      loadGalleryImages();
    }
  }, [product, isOpen]);

  const loadGalleryImages = async () => {
    if (!product) return;
    
    setLoading(true);
    try {
      console.log('Loading gallery images for product:', product.id);
      
      const images: string[] = [];
      
      // Load images from product_galleries table
      const { data: galleryData, error } = await supabase
        .from('product_galleries')
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order');

      if (!error && galleryData && galleryData.length > 0) {
        const galleryUrls = galleryData.map(img => img.image_url);
        images.push(...galleryUrls);
        console.log('Added gallery images:', galleryUrls);
      }
      
      // If product has a main image and it's not already in gallery, add it
      if (product.image && product.image.includes('http') && !images.includes(product.image)) {
        images.unshift(product.image);
        console.log('Added main product image:', product.image);
      }
      
      // If no images found, use placeholder
      if (images.length === 0) {
        images.push('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop');
      }
      
      setGalleryImages(images);
      console.log('Final gallery images:', images);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
      setGalleryImages(['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop']);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  if (!product) return null;

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : galleryImages.length > 0 ? (
                <>
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', galleryImages[currentImageIndex]);
                      e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                    }}
                  />
                  
                  {/* Navigation arrows */}
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
                  
                  {/* Image counter */}
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {galleryImages.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-16 h-16" />
                </div>
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
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={product.is_featured ? 'default' : 'secondary'}>
                  {product.is_featured ? 'Featured' : 'Standard'}
                </Badge>
                {product.is_flash_sale && (
                  <Badge className="bg-red-500">Flash Sale</Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
                {product.brand && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {product.brand}
                  </Badge>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">${product.original_price}</span>
                    <Badge className="bg-green-500">{discountPercentage}% OFF</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold">{product.rating}/5</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Eye className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Reviews</p>
                  <p className="font-semibold">{product.reviews}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p className="font-semibold">{product.stock} units</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Discount</p>
                  <p className="font-semibold">{product.discount_percentage}%</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Brand</span>
                <span className="font-medium">{product.brand || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Product ID</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">
                  {new Date(product.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
