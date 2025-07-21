
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Grid, List, Search } from 'lucide-react';
import { useProducts, Product, useDeleteProduct, useRestoreProduct, usePermanentDeleteProduct } from '@/hooks/useProducts';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import ImageUploadComponent from './ImageUploadComponent';

interface ProductsTabProps {
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ onAddProduct, onEditProduct }) => {
  const { data: products = [], isLoading, refetch } = useProducts(true); // Include deleted products
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewFilter, setViewFilter] = useState<'all' | 'active' | 'trashed'>('all');
  const { toast } = useToast();
  
  const deleteProductMutation = useDeleteProduct();
  const restoreProductMutation = useRestoreProduct();
  const permanentDeleteMutation = usePermanentDeleteProduct();

  const filteredProducts = products.filter(product => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm);

    let matchesView = true;
    if (viewFilter === 'active') {
      matchesView = !product.is_trashed;
    } else if (viewFilter === 'trashed') {
      matchesView = product.is_trashed;
    }

    return matchesSearch && matchesView;
  });

  const handleTrashProduct = async (product: Product) => {
    try {
      const confirmed = window.confirm(`Are you sure you want to trash ${product.name}?`);
      if (!confirmed) return;

      await deleteProductMutation.mutateAsync(product.id);
      refetch(); // Refresh products
    } catch (error: any) {
      toast({
        title: "Error trashing product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleRestoreProduct = async (product: Product) => {
    try {
      const confirmed = window.confirm(`Are you sure you want to restore ${product.name}?`);
      if (!confirmed) return;

      await restoreProductMutation.mutateAsync(product.id);
      refetch(); // Refresh products
    } catch (error: any) {
      toast({
        title: "Error restoring product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      const confirmed = window.confirm(`Are you sure you want to permanently delete ${product.name}? This action cannot be undone.`);
      if (!confirmed) return;

      await permanentDeleteMutation.mutateAsync(product.id);
      refetch(); // Refresh products
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      setShowAddModal(true);
    }
  };

  const handleEditProduct = (product: Product) => {
    if (onEditProduct) {
      onEditProduct(product);
    } else {
      setSelectedProduct(product);
      setShowEditModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
      </div>

      {/* Enhanced Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          
          {/* Image Upload Component */}
          <ImageUploadComponent
            onImageUploaded={(imageUrl) => {
              console.log('Image uploaded:', imageUrl);
              // You can add logic here to handle the uploaded image
              // For example, open add modal with pre-filled image
            }}
            buttonText="Upload Product Image"
          />

          <select
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value as 'all' | 'active' | 'trashed')}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="all">All Products</option>
            <option value="active">Active Products</option>
            <option value="trashed">Trashed Products</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                  <div className="aspect-w-4 aspect-h-3 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <p>Price: ${product.price}</p>
                  <p>Category: {product.category}</p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {viewFilter === 'trashed' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestoreProduct(product)}
                          className="text-green-500 hover:bg-gray-700"
                        >
                          Restore
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          Delete Forever
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleTrashProduct(product)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Trash
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <ScrollArea>
              <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-16 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          {viewFilter === 'trashed' ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestoreProduct(product)}
                                className="text-green-500 hover:bg-gray-700"
                              >
                                Restore
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                              >
                                Delete Forever
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleTrashProduct(product)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Trash
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-10 h-10 mx-auto mb-2" />
          No products found.
        </div>
      )}

      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditProductModal
        product={selectedProduct}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default ProductsTab;
