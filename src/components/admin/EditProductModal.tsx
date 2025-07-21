import React, { useState, useEffect } from 'react';
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
import { Product } from '@/hooks/useProducts';
import ProductImageGallery from './ProductImageGallery';
import ColorSelector from './ColorSelector';
import TagsInput from './TagsInput';
import WhatsInBoxInput from './WhatsInBoxInput';
import ProductSpecsInput from './ProductSpecsInput';

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface Color {
  name: string;
  hex_code: string;
}

const PRODUCT_CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Tablets',
  'Headphones',
  'Cameras',
  'Gaming',
  'Accessories',
  'Smart Watches',
  'Audio',
  'Home & Garden',
  'Electronics'
];

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [whatsInBox, setWhatsInBox] = useState<string[]>(['']);
  const [productSpecs, setProductSpecs] = useState<Array<{key: string, value: string}>>([]);
  const [editProduct, setEditProduct] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    brand: '',
    stock: '',
    is_featured: false,
    is_flash_sale: false,
    discount_percentage: ''
  });

  useEffect(() => {
    if (product) {
      console.log('Loading product data:', product);
      setEditProduct({
        name: product.name || '',
        description: product.description || '',
        price: product.price.toString(),
        original_price: product.original_price?.toString() || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock?.toString() || '',
        is_featured: product.is_featured || false,
        is_flash_sale: product.is_flash_sale || false,
        discount_percentage: product.discount_percentage?.toString() || ''
      });
      
      // Load colors
      if (product.colors && Array.isArray(product.colors)) {
        setSelectedColors(product.colors as Color[]);
      } else {
        setSelectedColors([]);
      }
      
      // Load tags
      if (product.tags && Array.isArray(product.tags)) {
        setProductTags(product.tags);
      } else {
        setProductTags([]);
      }
      
      // Load what's in the box
      if (product.whats_in_box && Array.isArray(product.whats_in_box)) {
        setWhatsInBox(product.whats_in_box);
      } else {
        setWhatsInBox(['']);
      }
      
      // Load specifications - Fixed parsing
      console.log('Raw specifications from product:', product.specifications);
      if (product.specifications) {
        try {
          let specs = product.specifications;
          // If it's a string, parse it
          if (typeof specs === 'string') {
            specs = JSON.parse(specs);
          }
          // Ensure it's an array of objects with key and value
          if (Array.isArray(specs)) {
            const validSpecs = specs.filter(spec => 
              spec && typeof spec === 'object' && 'key' in spec && 'value' in spec
            );
            setProductSpecs(validSpecs);
            console.log('Loaded specifications:', validSpecs);
          } else {
            setProductSpecs([]);
          }
        } catch (error) {
          console.error('Error parsing specifications:', error);
          setProductSpecs([]);
        }
      } else {
        setProductSpecs([]);
      }
      
      // Load existing gallery images
      loadGalleryImages();
    }
  }, [product]);

  const loadGalleryImages = async () => {
    try {
      console.log('Loading gallery images for product:', product.id);
      const { data: galleryImages, error } = await supabase
        .from('product_galleries')
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order');

      if (error) {
        console.error('Error loading gallery images:', error);
        // Fallback to main product image if it exists and is not a sample image
        if (product.image && !product.image.includes('unsplash.com')) {
          setProductImages([product.image]);
        }
      } else {
        const imageUrls = galleryImages.map(img => img.image_url);
        console.log('Loaded gallery images:', imageUrls);
        
        // Filter out sample/placeholder images
        const actualImages = imageUrls.filter(url => !url.includes('unsplash.com'));
        
        if (actualImages.length > 0) {
          setProductImages(actualImages);
        } else if (product.image && !product.image.includes('unsplash.com')) {
          setProductImages([product.image]);
        }
      }
    } catch (error) {
      console.error('Failed to load gallery images:', error);
      // Fallback to main product image if it's not a sample
      if (product.image && !product.image.includes('unsplash.com')) {
        setProductImages([product.image]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Updating product with specifications:', productSpecs);
      
      // Calculate discount percentage if original price is provided
      let calculatedDiscount = 0;
      if (editProduct.original_price && editProduct.price) {
        const original = parseFloat(editProduct.original_price);
        const current = parseFloat(editProduct.price);
        calculatedDiscount = Math.round(((original - current) / original) * 100);
      } else if (editProduct.discount_percentage) {
        calculatedDiscount = parseInt(editProduct.discount_percentage);
      }

      // Use the first selected image as main product image, or keep existing if no new images
      const mainProductImage = productImages.length > 0 ? productImages[0] : product.image;

      // Filter out empty items and specs
      const validWhatsInBox = whatsInBox.filter(item => item.trim() !== '');
      const validSpecs = productSpecs.filter(spec => 
        spec && spec.key && spec.value && spec.key.trim() !== '' && spec.value.trim() !== ''
      );

      console.log('Valid specifications to save:', validSpecs);

      const updateData = {
        name: editProduct.name,
        description: editProduct.description,
        price: parseFloat(editProduct.price),
        original_price: editProduct.original_price ? parseFloat(editProduct.original_price) : null,
        image: mainProductImage,
        category: editProduct.category,
        brand: editProduct.brand,
        stock: parseInt(editProduct.stock),
        is_featured: editProduct.is_featured,
        is_flash_sale: editProduct.is_flash_sale,
        discount_percentage: calculatedDiscount,
        colors: selectedColors.length > 0 ? JSON.parse(JSON.stringify(selectedColors)) : null,
        tags: productTags.length > 0 ? productTags : null,
        whats_in_box: validWhatsInBox.length > 0 ? validWhatsInBox : null,
        specifications: validSpecs.length > 0 ? JSON.parse(JSON.stringify(validSpecs)) : null,
      };

      console.log('Update data being sent:', updateData);

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      // Update gallery images - first clear existing ones, then add new ones
      await supabase
        .from('product_galleries')
        .delete()
        .eq('product_id', product.id);

      if (productImages.length > 0) {
        const galleryData = productImages.map((imageUrl, index) => ({
          product_id: product.id,
          image_url: imageUrl,
          display_order: index,
          is_main: index === 0
        }));

        console.log('Saving updated gallery data:', galleryData);

        const { error: galleryError } = await supabase
          .from('product_galleries')
          .insert(galleryData);

        if (galleryError) {
          console.error('Gallery update error:', galleryError);
        } else {
          console.log('Gallery updated successfully');
        }
      }

      toast({
        title: "Product updated successfully",
        description: `Updated with ${validSpecs.length} specifications, ${selectedColors.length} colors, ${productTags.length} tags, and ${validWhatsInBox.length} box items`
      });

      onClose();
      
      // Refresh products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', product.id] });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-gray-900 z-10 border-b border-gray-700">
          <CardTitle className="text-white">Edit Product</CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Product Name</Label>
                <Input
                  id="name"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand" className="text-gray-300">Brand</Label>
                <Input
                  id="brand"
                  value={editProduct.brand}
                  onChange={(e) => setEditProduct({...editProduct, brand: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={editProduct.description}
                onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
              />
            </div>

            {/* Pricing - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-gray-300">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="original_price" className="text-gray-300">Original Price</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={editProduct.original_price}
                  onChange={(e) => setEditProduct({...editProduct, original_price: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="stock" className="text-gray-300">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            {/* Category and Discount - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <Select value={editProduct.category} onValueChange={(value) => setEditProduct({...editProduct, category: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discount_percentage" className="text-gray-300">Discount %</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  value={editProduct.discount_percentage}
                  onChange={(e) => setEditProduct({...editProduct, discount_percentage: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Colors */}
            <ColorSelector 
              selectedColors={selectedColors}
              onColorsChange={setSelectedColors}
            />

            {/* Tags */}
            <TagsInput 
              tags={productTags}
              onTagsChange={setProductTags}
            />

            {/* Product Specifications - Enhanced */}
            <ProductSpecsInput 
              specs={productSpecs}
              onSpecsChange={setProductSpecs}
            />

            {/* What's in the Box */}
            <WhatsInBoxInput 
              items={whatsInBox}
              onItemsChange={setWhatsInBox}
            />

            {/* Product Image Gallery */}
            <div className="space-y-3">
              <ProductImageGallery 
                images={productImages}
                onImagesChange={(images) => {
                  console.log('Images changed in EditProductModal:', images);
                  setProductImages(images);
                }}
                maxImages={15}
                productId={product.id}
              />
            </div>

            {/* Features - Responsive Layout */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={editProduct.is_featured}
                  onChange={(e) => setEditProduct({...editProduct, is_featured: e.target.checked})}
                  className="mr-2"
                />
                Featured Product
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={editProduct.is_flash_sale}
                  onChange={(e) => setEditProduct({...editProduct, is_flash_sale: e.target.checked})}
                  className="mr-2"
                />
                Flash Sale
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-700">
              <Button type="button" variant="outline" onClick={onClose} className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;
