
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
import { X, Sparkles, ImageIcon, AlertCircle } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import ColorSelector from './ColorSelector';
import TagsInput from './TagsInput';
import WhatsInBoxInput from './WhatsInBoxInput';
import ProductSpecsInput from './ProductSpecsInput';
import AIProductGenerator from './AIProductGenerator';
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

const PRODUCT_BRANDS = [
  'Apple',
  'Samsung',
  'Google',
  'OnePlus',
  'Xiaomi',
  'Huawei',
  'Sony',
  'Dell',
  'HP',
  'Lenovo',
  'Asus',
  'Acer',
  'Microsoft',
  'Nintendo',
  'PlayStation',
  'Xbox',
  'Canon',
  'Nikon',
  'Bose',
  'JBL',
  'Beats',
  'Garmin',
  'Fitbit',
  'Other'
];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [whatsInBox, setWhatsInBox] = useState<string[]>(['']);
  const [customBrand, setCustomBrand] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [newProduct, setNewProduct] = useState({
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
  const [productSpecs, setProductSpecs] = useState<Array<{key: string, value: string}>>([]);

  const handleAIGenerate = (generatedData: {
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    features: string[];
    whats_in_box: string[];
    tags: string[];
    colors?: Array<{name: string, hex_code: string}>;
  }) => {
    console.log('Received AI generated data:', generatedData);
    
    // Update product basic info
    setNewProduct(prev => ({
      ...prev,
      name: generatedData.name,
      description: generatedData.description,
      category: generatedData.category,
      brand: generatedData.brand,
      price: generatedData.price.toString(),
      stock: '50' // Default stock
    }));

    // Convert features to specifications
    if (generatedData.features && generatedData.features.length > 0) {
      const specs = generatedData.features.map((feature, index) => ({
        key: `Feature ${index + 1}`,
        value: feature
      }));
      setProductSpecs(specs);
    }

    // Set what's in the box
    if (generatedData.whats_in_box && generatedData.whats_in_box.length > 0) {
      setWhatsInBox(generatedData.whats_in_box);
    }

    // Set tags
    if (generatedData.tags && generatedData.tags.length > 0) {
      setProductTags(generatedData.tags);
    }

    // Set colors if provided
    if (generatedData.colors && generatedData.colors.length > 0) {
      setSelectedColors(generatedData.colors);
    }

    // Hide AI generator after successful generation
    setShowAIGenerator(false);

    toast({
      title: "AI Generation Complete!",
      description: `Generated details for ${generatedData.name} with brand: ${generatedData.brand}`,
    });
  };

  const resetForm = () => {
    setNewProduct({
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
    setProductImages([]);
    setSelectedColors([]);
    setProductTags([]);
    setWhatsInBox(['']);
    setCustomBrand('');
    setProductSpecs([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productImages.length === 0) {
      toast({
        title: "Product Images Required",
        description: "Please upload at least one product image before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Calculate discount percentage if original price is provided
      let calculatedDiscount = 0;
      if (newProduct.original_price && newProduct.price) {
        const original = parseFloat(newProduct.original_price);
        const current = parseFloat(newProduct.price);
        calculatedDiscount = Math.round(((original - current) / original) * 100);
      } else if (newProduct.discount_percentage) {
        calculatedDiscount = parseInt(newProduct.discount_percentage);
      }

      // Filter out empty items and specs
      const validWhatsInBox = whatsInBox.filter(item => item.trim() !== '');
      const validSpecs = productSpecs.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '');
      const finalBrand = newProduct.brand === 'Other' && customBrand ? customBrand : newProduct.brand;

      const { data: product, error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
          image: productImages[0], // First image as main product image
          category: newProduct.category,
          brand: finalBrand,
          stock: parseInt(newProduct.stock),
          is_featured: newProduct.is_featured,
          is_flash_sale: newProduct.is_flash_sale,
          discount_percentage: calculatedDiscount,
          colors: selectedColors.length > 0 ? selectedColors as any : null,
          tags: productTags.length > 0 ? productTags : null,
          whats_in_box: validWhatsInBox.length > 0 ? validWhatsInBox : null,
          specifications: validSpecs.length > 0 ? validSpecs as any : null,
        })
        .select()
        .single();

      if (error) throw error;

      // Save gallery images
      if (productImages.length > 0) {
        const galleryData = productImages.map((imageUrl, index) => ({
          product_id: product.id,
          image_url: imageUrl,
          display_order: index,
          is_main: index === 0
        }));

        const { error: galleryError } = await supabase
          .from('product_galleries')
          .insert(galleryData);

        if (galleryError) {
          console.error('Gallery save error:', galleryError);
        }
      }

      toast({
        title: "Product added successfully",
        description: `${newProduct.name} has been added to the catalog with ${productImages.length} images, ${selectedColors.length} colors, ${productTags.length} tags, ${validWhatsInBox.length} box items, and ${validSpecs.length} specifications`
      });

      resetForm();
      onClose();
      
      // Refresh products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      toast({
        title: "Error adding product",
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
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
          <div>
            <CardTitle className="text-white flex items-center">
              Add New Product
              <Button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                variant="outline"
                size="sm"
                className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {showAIGenerator ? 'Hide AI' : 'Enhanced AI'}
              </Button>
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              {showAIGenerator ? 'Generate product details with enhanced AI (auto-detects brands & colors)' : 'Add product manually or use enhanced AI to generate details'}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {showAIGenerator && (
            <div className="mb-8">
              <EnhancedAIProductGenerator onGenerate={handleAIGenerate} />
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Images Section - More Prominent */}
            <div className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-600">
              <div className="flex items-center mb-4">
                <ImageIcon className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Product Images</h3>
                <span className="ml-2 text-red-400">*</span>
              </div>
              {productImages.length === 0 && (
                <div className="flex items-center mb-4 p-3 bg-amber-900/20 border border-amber-600 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-400 mr-2" />
                  <span className="text-amber-200 text-sm">At least one product image is required to publish the product</span>
                </div>
              )}
              <ProductImageGallery 
                images={productImages}
                onImagesChange={setProductImages}
                maxImages={15}
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand" className="text-gray-300">Brand *</Label>
                <Select value={newProduct.brand} onValueChange={(value) => setNewProduct({...newProduct, brand: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {PRODUCT_BRANDS.map((brand) => (
                      <SelectItem key={brand} value={brand} className="text-white hover:bg-gray-700">
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newProduct.brand === 'Other' && (
                  <Input
                    placeholder="Enter custom brand name"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white mt-2"
                  />
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={4}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-gray-300">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
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
                  value={newProduct.original_price}
                  onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="stock" className="text-gray-300">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            {/* Category and Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">Category *</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
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
                <Label htmlFor="discount_percentage" className="text-gray-300">Manual Discount %</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  value={newProduct.discount_percentage}
                  onChange={(e) => setNewProduct({...newProduct, discount_percentage: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Auto-calculated if original price is set"
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

            {/* Product Specifications */}
            <ProductSpecsInput 
              specs={productSpecs}
              onSpecsChange={setProductSpecs}
            />

            {/* What's in the Box */}
            <WhatsInBoxInput 
              items={whatsInBox}
              onItemsChange={setWhatsInBox}
            />

            {/* Features */}
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={newProduct.is_featured}
                  onChange={(e) => setNewProduct({...newProduct, is_featured: e.target.checked})}
                  className="mr-2"
                />
                Featured Product
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={newProduct.is_flash_sale}
                  onChange={(e) => setNewProduct({...newProduct, is_flash_sale: e.target.checked})}
                  className="mr-2"
                />
                Flash Sale
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || productImages.length === 0} 
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding Product...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductModal;
