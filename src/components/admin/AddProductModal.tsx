
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import ColorSelector from './ColorSelector';
import TagsInput from './TagsInput';
import WhatsInBoxInput from './WhatsInBoxInput';
import ProductSpecsInput from './ProductSpecsInput';
import EnhancedAIProductGenerator from './EnhancedAIProductGenerator';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Color {
  name: string;
  hex_code: string;
}

const PRODUCT_CATEGORIES = [
  'Smartphones', 'Laptops', 'Tablets', 'Headphones', 'Cameras',
  'Gaming', 'Accessories', 'Smart Watches', 'Audio', 'Home & Garden', 'Electronics'
];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [whatsInBox, setWhatsInBox] = useState<string[]>(['']);
  const [productSpecs, setProductSpecs] = useState<Array<{key: string, value: string}>>([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', original_price: '',
    category: '', brand: '', stock: '',
    is_featured: false, is_flash_sale: false, discount_percentage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast({ title: "Missing required fields", description: "Please fill in product name and price", variant: "destructive" });
      return;
    }
    if (productImages.length === 0) {
      toast({ title: "Missing product image", description: "Please add at least one product image", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      let calculatedDiscount = 0;
      const finalPrice = parseFloat(newProduct.price);
      const finalOriginalPrice = newProduct.original_price ? parseFloat(newProduct.original_price) : null;
      if (finalOriginalPrice && finalPrice) {
        calculatedDiscount = Math.round(((finalOriginalPrice - finalPrice) / finalOriginalPrice) * 100);
      } else if (newProduct.discount_percentage) {
        calculatedDiscount = parseInt(newProduct.discount_percentage);
      }

      const mainProductImage = productImages[featuredImageIndex];
      const validWhatsInBox = whatsInBox.filter(item => item.trim() !== '');
      const validSpecs = productSpecs.filter(spec => spec?.key?.trim() && spec?.value?.trim());

      const productData = {
        name: newProduct.name, description: newProduct.description,
        price: finalPrice, original_price: finalOriginalPrice,
        image: mainProductImage, category: newProduct.category, brand: newProduct.brand,
        stock: parseInt(newProduct.stock), is_featured: newProduct.is_featured,
        is_flash_sale: newProduct.is_flash_sale, discount_percentage: calculatedDiscount,
        colors: selectedColors.length > 0 ? JSON.parse(JSON.stringify(selectedColors)) : null,
        tags: productTags.length > 0 ? productTags : null,
        whats_in_box: validWhatsInBox.length > 0 ? validWhatsInBox : null,
        specifications: validSpecs.length > 0 ? JSON.parse(JSON.stringify(validSpecs)) : null,
      };

      const { data: product, error } = await supabase.from('products').insert(productData).select().single();
      if (error) throw error;

      if (productImages.length > 0) {
        const galleryData = productImages.map((imageUrl, index) => ({
          product_id: product.id, image_url: imageUrl, display_order: index, is_main: index === featuredImageIndex
        }));
        const { error: galleryError } = await supabase.from('product_galleries').insert(galleryData);
        if (galleryError) throw galleryError;
      }

      toast({ title: "Product created successfully", description: `Product "${newProduct.name}" has been added to the catalog` });
      setNewProduct({ name: '', description: '', price: '', original_price: '', category: '', brand: '', stock: '', is_featured: false, is_flash_sale: false, discount_percentage: '' });
      setProductImages([]); setFeaturedImageIndex(0); setSelectedColors([]); setProductTags([]); setWhatsInBox(['']); setProductSpecs([]); setShowAIGenerator(false);
      onClose();
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      toast({ title: "Error creating product", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedImageChange = (index: number) => {
    setFeaturedImageIndex(index);
    toast({ title: "Featured image updated", description: `Image ${index + 1} is now set as the featured image` });
  };

  const handleImagesChange = (images: string[]) => {
    setProductImages(images);
    if (featuredImageIndex >= images.length) setFeaturedImageIndex(Math.max(0, images.length - 1));
  };

  const handleAIGenerate = (generatedData: any) => {
    setNewProduct({ ...newProduct, name: generatedData.name || '', description: generatedData.description || '', price: generatedData.price ? generatedData.price.toString() : '', brand: generatedData.brand || '', category: generatedData.category || '' });
    if (generatedData.tags && Array.isArray(generatedData.tags)) setProductTags(generatedData.tags);
    if (generatedData.whats_in_box && Array.isArray(generatedData.whats_in_box)) setWhatsInBox(generatedData.whats_in_box);
    if (generatedData.colors && Array.isArray(generatedData.colors)) setSelectedColors(generatedData.colors);
    if (Array.isArray(generatedData.specifications) && generatedData.specifications.length > 0) setProductSpecs(generatedData.specifications);
    setShowAIGenerator(false);
    toast({ title: "AI Generation Complete!", description: `Product "${generatedData.name}" has been generated ($${generatedData.price})` });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto border">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10 border-b border-border">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-foreground">Add New Product</CardTitle>
            <Button onClick={() => setShowAIGenerator(!showAIGenerator)} variant="outline" size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30">
              ✨ AI Generate
            </Button>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {showAIGenerator && <div className="mb-6"><EnhancedAIProductGenerator onGenerate={handleAIGenerate} /></div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Product Name</Label><Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required /></div>
              <div><Label htmlFor="brand">Brand</Label><Input id="brand" value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} /></div>
            </div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="min-h-[100px]" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><Label htmlFor="price">Price</Label><Input id="price" type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required /></div>
              <div><Label htmlFor="original_price">Original Price</Label><Input id="original_price" type="number" step="0.01" value={newProduct.original_price} onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})} /></div>
              <div><Label htmlFor="stock">Stock</Label><Input id="stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>{PRODUCT_CATEGORIES.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="discount_percentage">Discount %</Label><Input id="discount_percentage" type="number" value={newProduct.discount_percentage} onChange={(e) => setNewProduct({...newProduct, discount_percentage: e.target.value})} /></div>
            </div>

            <ColorSelector selectedColors={selectedColors} onColorsChange={setSelectedColors} />
            <TagsInput tags={productTags} onTagsChange={setProductTags} />
            <ProductSpecsInput specs={productSpecs} onSpecsChange={setProductSpecs} />
            <WhatsInBoxInput items={whatsInBox} onItemsChange={setWhatsInBox} />

            <div className="space-y-3">
              <div className="bg-accent/50 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-amber-600 font-medium text-sm">Featured Image Selection</span>
                </div>
                <p className="text-muted-foreground text-sm">Click the star icon on any image to set it as the featured image.</p>
                {productImages.length > 0 && <p className="text-primary text-xs mt-1">Currently selected: Image {featuredImageIndex + 1} of {productImages.length}</p>}
              </div>
              <ProductImageGallery images={productImages} onImagesChange={handleImagesChange} featuredImageIndex={featuredImageIndex} onFeaturedImageChange={handleFeaturedImageChange} maxImages={15} productId="new" />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="flex items-center text-foreground"><input type="checkbox" checked={newProduct.is_featured} onChange={(e) => setNewProduct({...newProduct, is_featured: e.target.checked})} className="mr-2" />Featured Product</label>
              <label className="flex items-center text-foreground"><input type="checkbox" checked={newProduct.is_flash_sale} onChange={(e) => setNewProduct({...newProduct, is_flash_sale: e.target.checked})} className="mr-2" />Flash Sale</label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Product'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductModal;
