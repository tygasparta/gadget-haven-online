
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Package, DollarSign, Eye, ChevronLeft, ChevronRight, Cpu } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface ViewProductModalProps { product: Product | null; isOpen: boolean; onClose: () => void; }

const ViewProductModal: React.FC<ViewProductModalProps> = ({ product, isOpen, onClose }) => {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (product && isOpen) loadGalleryImages(); }, [product, isOpen]);

  const loadGalleryImages = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const images: string[] = [];
      const { data: galleryData, error } = await supabase.from('product_galleries').select('image_url').eq('product_id', product.id).order('display_order');
      if (!error && galleryData && galleryData.length > 0) images.push(...galleryData.map(img => img.image_url));
      if (product.image && product.image.includes('http') && !images.includes(product.image)) images.unshift(product.image);
      if (images.length === 0) images.push('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop');
      setGalleryImages(images);
    } catch { setGalleryImages(['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop']); }
    finally { setLoading(false); }
  };

  if (!product) return null;
  const discountPercentage = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-2xl font-bold text-foreground">Product Details</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square bg-muted/50 rounded-lg overflow-hidden relative group">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : galleryImages.length > 0 ? (
                <>
                  <img src={galleryImages[currentImageIndex]} alt={`${product.name} - Image ${currentImageIndex + 1}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"; }} />
                  {galleryImages.length > 1 && (
                    <>
                      <Button onClick={() => setCurrentImageIndex((p) => (p - 1 + galleryImages.length) % galleryImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
                      <Button onClick={() => setCurrentImageIndex((p) => (p + 1) % galleryImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">{currentImageIndex + 1} / {galleryImages.length}</div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package className="w-16 h-16" /></div>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {galleryImages.map((url, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-primary' : 'border-border'}`}>
                    <img src={url} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"; }} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant={product.is_featured ? 'default' : 'secondary'}>{product.is_featured ? 'Featured' : 'Standard'}</Badge>
                {product.is_flash_sale && <Badge className="bg-destructive text-destructive-foreground">Flash Sale</Badge>}
                <Badge variant="outline">{product.category}</Badge>
                {product.brand && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">{product.brand}</Badge>}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.original_price && (<><span className="text-lg text-muted-foreground line-through">${product.original_price}</span><Badge className="bg-emerald-500 text-white">{discountPercentage}% OFF</Badge></>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Star, color: 'text-amber-500', label: 'Rating', value: `${product.rating}/5` },
                { icon: Eye, color: 'text-primary', label: 'Reviews', value: product.reviews },
                { icon: Package, color: 'text-emerald-500', label: 'Stock', value: `${product.stock} units` },
                { icon: DollarSign, color: 'text-violet-500', label: 'Discount', value: `${product.discount_percentage}%` },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div><p className="text-sm text-muted-foreground">{item.label}</p><p className="font-semibold text-foreground">{item.value}</p></div>
                </div>
              ))}
            </div>
            <div><h3 className="text-lg font-semibold text-foreground mb-2">Description</h3><p className="text-muted-foreground leading-relaxed">{product.description || 'No description available.'}</p></div>
            <div className="space-y-3">
              {[
                { label: 'Brand', value: product.brand || 'N/A' },
                { label: 'Product ID', value: `#${product.id}` },
                { label: 'Created', value: new Date(product.created_at).toLocaleDateString() },
                { label: 'Last Updated', value: new Date(product.updated_at).toLocaleDateString() },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center py-2 ${i < 3 ? 'border-b border-border' : ''}`}>
                  <span className="text-muted-foreground">{item.label}</span><span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-8 bg-accent/50 rounded-xl p-4 sm:p-6 border border-primary/20">
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center"><Cpu className="w-6 h-6 mr-3 text-primary" />Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-card rounded-lg shadow-sm border border-border">
                  <span className="text-muted-foreground font-medium text-sm sm:text-base">{spec.key}</span>
                  <span className="font-semibold text-foreground text-sm sm:text-base mt-1 sm:mt-0">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {product.colors && product.colors.length > 0 && (
            <div><h3 className="font-semibold mb-3 text-lg text-foreground">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-border" style={{ backgroundColor: color.hex_code }}></div>
                    <span className="text-sm font-medium text-foreground">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {product.whats_in_box && product.whats_in_box.length > 0 && (
            <div><h3 className="font-semibold mb-3 text-lg text-foreground">What's in the Box</h3>
              <div className="space-y-1">
                {product.whats_in_box.map((item, index) => (
                  <div key={index} className="flex items-center p-2 bg-emerald-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-6"><h3 className="font-semibold mb-3 text-lg text-foreground">Product Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (<span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">#{tag}</span>))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
