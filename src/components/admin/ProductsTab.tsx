
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Search, Eye, AlertTriangle, RefreshCw, Package, Undo2, TrashIcon, Archive } from 'lucide-react';
import { useProducts, useDeleteProduct, useRestoreProduct, usePermanentDeleteProduct, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import ViewProductModal from './ViewProductModal';

interface ProductsTabProps {
  onAddProduct: () => void;
  onEditProduct: (product: any) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ onAddProduct, onEditProduct }) => {
  const [viewMode, setViewMode] = useState<'active' | 'trash'>('active');
  const { data: products = [], isLoading, error, refetch } = useProducts(viewMode === 'trash');
  const deleteProductMutation = useDeleteProduct();
  const restoreProductMutation = useRestoreProduct();
  const permanentDeleteMutation = usePermanentDeleteProduct();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter products based on view mode
  const filteredByMode = products.filter(product => {
    if (viewMode === 'active') {
      return !product.deleted_at;
    } else {
      return product.deleted_at;
    }
  });

  const filteredProducts = filteredByMode.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to move "${productName}" to trash? You can restore it later.`)) {
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(productId);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleRestoreProduct = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to restore "${productName}"?`)) {
      return;
    }

    try {
      await restoreProductMutation.mutateAsync(productId);
    } catch (error) {
      console.error('Failed to restore product:', error);
    }
  };

  const handlePermanentDelete = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await permanentDeleteMutation.mutateAsync(productId);
    } catch (error) {
      console.error('Failed to permanently delete product:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Products refreshed",
        description: "Product list has been updated"
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh product list",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeCount = products.filter(p => !p.deleted_at).length;
  const trashedCount = products.filter(p => p.deleted_at).length;

  if (error) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Products</h3>
          <p className="text-gray-300 mb-4">Failed to load products from the database</p>
          <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">Product Management</h3>
              <p className="text-gray-400 text-sm">
                {isLoading ? 'Loading...' : `${filteredProducts.length} products ${viewMode === 'active' ? 'active' : 'in trash'}`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-black/30 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('active')}
                  variant={viewMode === 'active' ? 'default' : 'ghost'}
                  size="sm"
                  className={`${viewMode === 'active' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Active ({activeCount})
                </Button>
                <Button
                  onClick={() => setViewMode('trash')}
                  variant={viewMode === 'trash' ? 'default' : 'ghost'}
                  size="sm"
                  className={`${viewMode === 'trash' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Trash ({trashedCount})
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-64"
                />
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 border-blue-500"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {viewMode === 'active' && (
                <Button
                  onClick={onAddProduct}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {viewMode === 'trash' ? (
                  <TrashIcon className="w-8 h-8 text-gray-400" />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h4 className="text-lg font-medium text-gray-300 mb-2">
                {searchTerm ? 'No products found' : viewMode === 'trash' ? 'No products in trash' : 'No products yet'}
              </h4>
              <p className="text-gray-400 mb-4">
                {searchTerm 
                  ? `No products match "${searchTerm}"`
                  : viewMode === 'trash' 
                    ? 'Deleted products will appear here'
                    : 'Start by adding your first product to the catalog'
                }
              </p>
              {!searchTerm && viewMode === 'active' && (
                <Button onClick={onAddProduct} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-gray-300">Product</th>
                    <th className="text-left p-4 text-gray-300">Category</th>
                    <th className="text-left p-4 text-gray-300">Price</th>
                    <th className="text-left p-4 text-gray-300">Stock</th>
                    <th className="text-left p-4 text-gray-300">Sales</th>
                    <th className="text-left p-4 text-gray-300">Rating</th>
                    <th className="text-left p-4 text-gray-300">Status</th>
                    {viewMode === 'trash' && <th className="text-left p-4 text-gray-300">Deleted</th>}
                    <th className="text-left p-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium truncate ${viewMode === 'trash' ? 'text-gray-400' : 'text-white'}`}>
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-400">{product.brand || 'No brand'}</p>
                            <p className="text-xs text-gray-500">{product.reviews} reviews</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                          {product.category || 'Uncategorized'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className={`font-medium ${viewMode === 'trash' ? 'text-gray-400' : 'text-white'}`}>
                            ${product.price}
                          </span>
                          {product.original_price && (
                            <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className={`font-medium ${
                            viewMode === 'trash' 
                              ? 'text-gray-400' 
                              : product.stock <= 10 
                                ? 'text-orange-400' 
                                : 'text-white'
                          }`}>
                            {product.stock}
                          </span>
                          {product.stock <= 10 && viewMode === 'active' && (
                            <AlertTriangle className="w-4 h-4 text-orange-400 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className={`p-4 ${viewMode === 'trash' ? 'text-gray-400' : 'text-white'}`}>
                        {product.reviews}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className={`ml-1 ${viewMode === 'trash' ? 'text-gray-400' : 'text-white'}`}>
                            {product.rating}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-1">
                          {viewMode === 'trash' ? (
                            <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">
                              Deleted
                            </Badge>
                          ) : (
                            <>
                              <Badge 
                                variant={product.stock > 10 ? 'default' : 'secondary'}
                                className={`${product.stock > 10 ? 'bg-green-600/20 text-green-400 border-green-600/30' : 'bg-orange-600/20 text-orange-400 border-orange-600/30'} text-xs`}
                              >
                                {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                              </Badge>
                              {product.is_featured && (
                                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                                  Featured
                                </Badge>
                              )}
                              {product.is_flash_sale && (
                                <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">
                                  Flash Sale
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      {viewMode === 'trash' && (
                        <td className="p-4">
                          <span className="text-sm text-gray-400">
                            {product.deleted_at ? new Date(product.deleted_at).toLocaleDateString() : '-'}
                          </span>
                        </td>
                      )}
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-400"
                            onClick={() => setViewingProduct(product)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {viewMode === 'active' ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-400"
                                onClick={() => onEditProduct(product)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-400"
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                disabled={deleteProductMutation.isPending}
                              >
                                <Archive className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-400"
                                onClick={() => handleRestoreProduct(product.id, product.name)}
                                disabled={restoreProductMutation.isPending}
                              >
                                <Undo2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-400"
                                onClick={() => handlePermanentDelete(product.id, product.name)}
                                disabled={permanentDeleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {searchTerm && filteredProducts.length > 0 && (
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredProducts.length} of {filteredByMode.length} products
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Product Modal */}
      <ViewProductModal 
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
      />
    </>
  );
};

export default ProductsTab;
