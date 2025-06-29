import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState({
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

  useEffect(() => {
    if (product) {
      setEditProduct({
        name: product.name || '',
        description: product.description || '',
        price: product.price.toString(),
        original_price: product.original_price?.toString() || '',
        image: product.image || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock?.toString() || '',
        is_featured: product.is_featured || false,
        is_flash_sale: product.is_flash_sale || false,
        discount_percentage: product.discount_percentage?.toString() || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editProduct.name,
          description: editProduct.description,
          price: parseFloat(editProduct.price),
          original_price: editProduct.original_price ? parseFloat(editProduct.original_price) : null,
          image: editProduct.image,
          category: editProduct.category,
          brand: editProduct.brand,
          stock: parseInt(editProduct.stock),
          is_featured: editProduct.is_featured,
          is_flash_sale: editProduct.is_flash_sale,
          discount_percentage: editProduct.discount_percentage ? parseInt(editProduct.discount_percentage) : 0,
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Product updated successfully",
        description: "The product has been updated in the catalog"
      });

      onClose();
      
      // Refresh products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <Input
                  id="category"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
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
            
            <div>
              <Label htmlFor="image" className="text-gray-300">Image URL</Label>
              <Input
                id="image"
                value={editProduct.image}
                onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            <div className="flex space-x-4">
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

            <div className="flex justify-end space-x-2 pt-4">
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
