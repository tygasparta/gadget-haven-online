
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
import { X, Upload, AlertCircle } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image: '',
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
      image: '',
      category: '',
      brand: '',
      stock: '',
      is_featured: false,
      is_flash_sale: false,
      discount_percentage: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setValidationErrors({});
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

    if (!selectedImage && !newProduct.image) {
      errors.image = 'Product image is required';
    }

    if (newProduct.original_price && parseFloat(newProduct.original_price) <= parseFloat(newProduct.price)) {
      errors.original_price = 'Original price must be higher than current price';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, GIF, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      setValidationErrors(prev => ({ ...prev, image: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      console.log('Image selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setIsUploading(true);
    try {
      // Check current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Authentication error:', userError);
        throw new Error('You must be logged in to upload images');
      }

      console.log('Current user:', user.email);

      // Generate unique filename
      const fileExt = selectedImage.name.split('.').pop()?.toLowerCase();
      const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Starting image upload to bucket "gallary":', fileName);

      const { data, error } = await supabase.storage
        .from('gallary')
        .upload(fileName, selectedImage, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedImage.type
        });

      if (error) {
        console.error('Storage upload error details:', {
          message: error.message,
          error: error
        });
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('gallary')
        .getPublicUrl(fileName);

      console.log('Public URL generated:', urlData.publicUrl);
      
      if (!urlData.publicUrl) {
        throw new Error('Failed to generate public URL for uploaded image');
      }

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Image upload failed:', error);
      toast({
        title: "Image upload failed",
        description: error.message || "Failed to upload image to storage",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
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
      console.log('Starting product creation process...');
      
      // Check if user is authenticated and has admin role
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to add products');
      }

      console.log('Current user authenticated:', user.email);
      
      let imageUrl = newProduct.image;

      // Upload image if selected
      if (selectedImage) {
        console.log('Uploading selected image...');
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setIsLoading(false);
          return; // Upload failed, don't continue
        }
        imageUrl = uploadedUrl;
      }

      if (!imageUrl) {
        toast({
          title: "Image required",
          description: "Please upload an image or provide an image URL",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Calculate discount percentage if original price is provided
      let calculatedDiscount = 0;
      if (newProduct.original_price && newProduct.price) {
        const original = parseFloat(newProduct.original_price);
        const current = parseFloat(newProduct.price);
        calculatedDiscount = Math.round(((original - current) / original) * 100);
      } else if (newProduct.discount_percentage) {
        calculatedDiscount = parseInt(newProduct.discount_percentage);
      }

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim() || null,
        price: parseFloat(newProduct.price),
        original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
        image: imageUrl,
        category: newProduct.category,
        brand: newProduct.brand.trim() || null,
        stock: parseInt(newProduct.stock),
        is_featured: newProduct.is_featured,
        is_flash_sale: newProduct.is_flash_sale,
        discount_percentage: calculatedDiscount,
        rating: 4.5,
        reviews: 0
      };

      console.log('Inserting product data:', JSON.stringify(productData, null, 2));

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error('Database insert error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          error: error
        });
        throw new Error(`Failed to add product: ${error.message}`);
      }

      console.log('Product created successfully:', data);

      toast({
        title: "Product added successfully!",
        description: `${newProduct.name} has been added to the catalog`,
      });

      // Reset form and close modal
      resetForm();
      onClose();
      
      // Refresh products list
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                }}>
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
            
            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label className="text-gray-300">Product Image *</Label>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </label>
                  {isUploading && (
                    <div className="flex items-center space-x-2 text-blue-400">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative w-32 h-32 border-2 border-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview('');
                      }}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Alternative: Manual URL Input */}
                <div className="text-sm text-gray-400">Or provide image URL manually:</div>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.image}
                  onChange={(e) => {
                    setNewProduct({...newProduct, image: e.target.value});
                    setValidationErrors(prev => ({ ...prev, image: '' }));
                  }}
                  className={`bg-gray-800 border-gray-600 text-white ${validationErrors.image ? 'border-red-500' : ''}`}
                />
                
                {validationErrors.image && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.image}
                  </p>
                )}
              </div>
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
                disabled={isLoading || isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isUploading} 
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductModal;
