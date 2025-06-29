
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
          image: newProduct.image,
          category: newProduct.category,
          brand: newProduct.brand,
          stock: parseInt(newProduct.stock),
          is_featured: newProduct.is_featured,
          is_flash_sale: newProduct.is_flash_sale,
          discount_percentage: newProduct.discount_percentage ? parseInt(newProduct.discount_percentage) : 0,
          rating: 4.5,
          reviews: 0
        });

      if (error) throw error;

      toast({
        title: "Product added successfully",
        description: "The new product has been added to the catalog"
      });

      // Reset form and close modal
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Add New Product</CardTitle>
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
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand" className="text-gray-300">Brand</Label>
                <Input
                  id="brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
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
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-gray-300">Price</Label>
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
                <Label htmlFor="stock" className="text-gray-300">Stock</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage" className="text-gray-300">Discount %</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  value={newProduct.discount_percentage}
                  onChange={(e) => setNewProduct({...newProduct, discount_percentage: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image" className="text-gray-300">Image URL</Label>
              <Input
                id="image"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

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
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? 'Adding...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductModal;
