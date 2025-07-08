
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { X, AlertCircle, Sparkles, Plus } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import AIProductGenerator from './AIProductGenerator';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [productImages, setProductImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('manual');
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
    setValidationErrors({});
    setActiveTab('manual');
  };

  const handleAIGeneration = (generatedData: any) => {
    setNewProduct(prev => ({
      ...prev,
      name: generatedData.name || '',
      description: generatedData.description || '',
      category: generatedData.category || '',
      brand: generatedData.brand || ''
    }));
    setActiveTab('manual');
    
    toast({
      title: "Details generated!",
      description: "You can now add pricing, stock, and images to complete the product.",
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newProduct.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      errors.stock = 'Valid stock quantity is required';
    }

    if (!newProduct.category) {
      errors.category = 'Category is required';
    }

    if (productImages.length === 0) {
      errors.images = 'At least one product image is required';
    }

    if (newProduct.original_price && parseFloat(newProduct.original_price) <= parseFloat(newProduct.price)) {
      errors.original_price = 'Original price must be higher than current price';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to add products');
      }

      if (productImages.length === 0) {
        throw new Error('Please upload at least one product image');
      }

      let calculatedDiscount = 0;
      if (newProduct.original_price && newProduct.price) {
        const original = parseFloat(newProduct.original_price);
        const current = parseFloat(newProduct.price);
        calculatedDiscount = Math.round(((original - current) / original) * 100);
      } else if (newProduct.discount_percentage) {
        calculatedDiscount = parseInt(newProduct.discount_percentage);
      }

      const mainProductImage = productImages[0];

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim() || null,
        price: parseFloat(newProduct.price),
        original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
        image: mainProductImage,
        category: newProduct.category,
        brand: newProduct.brand.trim() || null,
        stock: parseInt(newProduct.stock),
        is_featured: newProduct.is_featured,
        is_flash_sale: newProduct.is_flash_sale,
        discount_percentage: calculatedDiscount,
        rating: 4.5,
        reviews: 0
      };

      const { data: insertedProduct, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add product: ${error.message}`);
      }

      if (productImages.length > 0) {
        const galleryData = productImages.map((imageUrl, index) => ({
          product_id: insertedProduct.id,
          image_url: imageUrl,
          display_order: index,
          is_main: index === 0
        }));

        const { error: galleryError } = await supabase
          .from('product_galleries')
          .insert(galleryData);

        if (galleryError) {
          console.error('Gallery insert error:', galleryError);
        }
      }

      toast({
        title: "Product added successfully!",
        description: `${newProduct.name} has been added with your uploaded images`,
      });

      resetForm();
      onClose();
      
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      await queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] });
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error adding product",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Add New Product</CardTitle>
          <Button
            onClick={() => {
              resetForm();
              onClose();
            }}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generator
              </TabsTrigger>
              <TabsTrigger value="manual" className="data-[state=active]:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              <AIProductGenerator onGenerate={handleAIGeneration} />
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => {
                        setNewProduct({...newProduct, name: e.target.value});
                        setValidationErrors(prev => ({ ...prev, name: '' }));
                      }}
                      className={`bg-gray-800 border-gray-600 text-white ${validationErrors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter product name"
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="brand" className="text-gray-300">Brand</Label>
                    <Input
                      id="brand"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-gray-300">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => {
                        setNewProduct({...newProduct, price: e.target.value});
                        setValidationErrors(prev => ({ ...prev, price: '' }));
                      }}
                      className={`bg-gray-800 border-gray-600 text-white ${validationErrors.price ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                    />
                    {validationErrors.price && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="original_price" className="text-gray-300">Original Price</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.original_price}
                      onChange={(e) => {
                        setNewProduct({...newProduct, original_price: e.target.value});
                        setValidationErrors(prev => ({ ...prev, original_price: '' }));
                      }}
                      className={`bg-gray-800 border-gray-600 text-white ${validationErrors.original_price ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                    />
                    {validationErrors.original_price && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.original_price}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="stock" className="text-gray-300">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => {
                        setNewProduct({...newProduct, stock: e.target.value});
                        setValidationErrors(prev => ({ ...prev, stock: '' }));
                      }}
                      className={`bg-gray-800 border-gray-600 text-white ${validationErrors.stock ? 'border-red-500' : ''}`}
                      placeholder="0"
                    />
                    {validationErrors.stock && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-gray-300">Category *</Label>
                    <Select onValueChange={(value) => {
                      setNewProduct({...newProduct, category: value});
                      setValidationErrors(prev => ({ ...prev, category: '' }));
                    }} value={newProduct.category}>
                      <SelectTrigger className={`bg-gray-800 border-gray-600 text-white ${validationErrors.category ? 'border-red-500' : ''}`}>
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
                    {validationErrors.category && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.category}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="discount_percentage" className="text-gray-300">Manual Discount %</Label>
                    <Input
                      id="discount_percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={newProduct.discount_percentage}
                      onChange={(e) => setNewProduct({...newProduct, discount_percentage: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-400 mt-1">Auto-calculated if original price is set</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <ProductImageGallery 
                    images={productImages}
                    onImagesChange={(images) => {
                      setProductImages(images);
                      setValidationErrors(prev => ({ ...prev, images: '' }));
                    }}
                    maxImages={5}
                  />
                  {validationErrors.images && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.images}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <label className="flex items-center text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.is_featured}
                      onChange={(e) => setNewProduct({...newProduct, is_featured: e.target.checked})}
                      className="mr-2 rounded"
                    />
                    Featured Product
                  </label>
                  <label className="flex items-center text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.is_flash_sale}
                      onChange={(e) => setNewProduct({...newProduct, is_flash_sale: e.target.checked})}
                      className="mr-2 rounded"
                    />
                    Flash Sale
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Adding Product...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductModal;
