
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import ViewProductModal from './ViewProductModal';

const ProductsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  
  const { data: products = [], isLoading, refetch } = useProducts(includeDeleted);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProducts = filteredProducts.filter(product => !product.is_trashed);
  const deletedProducts = filteredProducts.filter(product => product.is_trashed);

  const handleSoftDelete = async (productId: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product moved to trash successfully');
      refetch();
    } catch (error) {
      console.error('Error soft deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleHardDelete = async (productId: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product permanently deleted');
      refetch();
    } catch (error) {
      console.error('Error hard deleting product:', error);
      toast.error('Failed to permanently delete product');
    }
  };

  const handleRestore = async (productId: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: null })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product restored successfully');
      refetch();
    } catch (error) {
      console.error('Error restoring product:', error);
      toast.error('Failed to restore product');
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const ProductCard = ({ product, isDeleted = false }: { product: any; isDeleted?: boolean }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isDeleted ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <p className="text-xs text-gray-500 truncate">{product.brand}</p>
            <p className="text-sm font-medium text-green-600">${product.price}</p>
            <div className="flex items-center space-x-2 mt-2">
              {product.is_featured && (
                <Badge variant="secondary" className="text-xs">Featured</Badge>
              )}
              {product.is_flash_sale && (
                <Badge variant="destructive" className="text-xs">Flash Sale</Badge>
              )}
              <Badge variant="outline" className="text-xs">{product.category}</Badge>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleView(product);
              }}
              className="h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
            {!isDeleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(product);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {isDeleted ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(product.id);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHardDelete(product.id);
                  }}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSoftDelete(product.id);
                }}
                className="h-8 w-8 p-0 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Products ({activeProducts.length})</TabsTrigger>
          <TabsTrigger value="deleted">Deleted Products ({deletedProducts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No active products found</div>
            ) : (
              activeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="deleted" className="space-y-4">
          <div className="grid gap-4">
            {deletedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No deleted products found</div>
            ) : (
              deletedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isDeleted={true} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          refetch();
          setIsEditModalOpen(false);
        }}
      />

      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsTab;
