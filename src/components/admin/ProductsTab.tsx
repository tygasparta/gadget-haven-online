
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

  const filteredByMode = products.filter(product => {
    if (viewMode === 'active') return !product.deleted_at;
    return product.deleted_at;
  });

  const filteredProducts = filteredByMode.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to move "${productName}" to trash?`)) return;
    try { await deleteProductMutation.mutateAsync(productId); } catch (e) { console.error(e); }
  };

  const handleRestoreProduct = async (productId: number, productName: string) => {
    if (!confirm(`Restore "${productName}"?`)) return;
    try { await restoreProductMutation.mutateAsync(productId); } catch (e) { console.error(e); }
  };

  const handlePermanentDelete = async (productId: number, productName: string) => {
    if (!confirm(`PERMANENTLY delete "${productName}"? This cannot be undone.`)) return;
    try { await permanentDeleteMutation.mutateAsync(productId); } catch (e) { console.error(e); }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({ title: "Products refreshed", description: "Product list has been updated" });
    } catch {
      toast({ title: "Refresh failed", description: "Failed to refresh product list", variant: "destructive" });
    } finally { setIsRefreshing(false); }
  };

  const activeCount = products.filter(p => !p.deleted_at).length;
  const trashedCount = products.filter(p => p.deleted_at).length;

  if (error) {
    return (
      <Card className="border">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold text-destructive mb-2">Error Loading Products</h3>
          <p className="text-muted-foreground mb-4">Failed to load products from the database</p>
          <Button onClick={handleRefresh}><RefreshCw className="w-4 h-4 mr-2" />Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Product Management</h3>
              <p className="text-muted-foreground text-sm">
                {isLoading ? 'Loading...' : `${filteredProducts.length} products ${viewMode === 'active' ? 'active' : 'in trash'}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('active')}
                  variant={viewMode === 'active' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Active ({activeCount})
                </Button>
                <Button
                  onClick={() => setViewMode('trash')}
                  variant={viewMode === 'trash' ? 'destructive' : 'ghost'}
                  size="sm"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Trash ({trashedCount})
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {viewMode === 'active' && (
                <Button onClick={onAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                {viewMode === 'trash' ? <TrashIcon className="w-8 h-8 text-muted-foreground" /> : <Package className="w-8 h-8 text-muted-foreground" />}
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? 'No products found' : viewMode === 'trash' ? 'No products in trash' : 'No products yet'}
              </h4>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? `No products match "${searchTerm}"` : viewMode === 'trash' ? 'Deleted products will appear here' : 'Start by adding your first product'}
              </p>
              {!searchTerm && viewMode === 'active' && (
                <Button onClick={onAddProduct}><Plus className="w-4 h-4 mr-2" />Add Your First Product</Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Product</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Category</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Price</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Stock</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Reviews</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Rating</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                    {viewMode === 'trash' && <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Deleted</th>}
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"; }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium truncate ${viewMode === 'trash' ? 'text-muted-foreground' : 'text-foreground'}`}>{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand || 'No brand'}</p>
                            <p className="text-xs text-muted-foreground">{product.reviews} reviews</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{product.category || 'Uncategorized'}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className={`font-medium ${viewMode === 'trash' ? 'text-muted-foreground' : 'text-foreground'}`}>${product.price}</span>
                          {product.original_price && <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className={`font-medium ${viewMode === 'trash' ? 'text-muted-foreground' : product.stock <= 10 ? 'text-amber-600' : 'text-foreground'}`}>{product.stock}</span>
                          {product.stock <= 10 && viewMode === 'active' && <AlertTriangle className="w-4 h-4 text-amber-500 ml-2" />}
                        </div>
                      </td>
                      <td className={`p-4 ${viewMode === 'trash' ? 'text-muted-foreground' : 'text-foreground'}`}>{product.reviews}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="text-amber-500">★</span>
                          <span className={`ml-1 ${viewMode === 'trash' ? 'text-muted-foreground' : 'text-foreground'}`}>{product.rating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-1">
                          {viewMode === 'trash' ? (
                            <Badge variant="destructive" className="text-xs">Deleted</Badge>
                          ) : (
                            <>
                              <Badge variant="secondary" className={`text-xs ${product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                              </Badge>
                              {product.is_featured && <Badge variant="secondary" className="text-xs bg-accent text-primary">Featured</Badge>}
                              {product.is_flash_sale && <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">Flash Sale</Badge>}
                            </>
                          )}
                        </div>
                      </td>
                      {viewMode === 'trash' && (
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{product.deleted_at ? new Date(product.deleted_at).toLocaleDateString() : '-'}</span>
                        </td>
                      )}
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setViewingProduct(product)}><Eye className="w-4 h-4" /></Button>
                          {viewMode === 'active' ? (
                            <>
                              <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => onEditProduct(product)}><Edit className="w-4 h-4" /></Button>
                              <Button size="sm" variant="outline" className="text-destructive border-red-200 hover:bg-red-50" onClick={() => handleDeleteProduct(product.id, product.name)} disabled={deleteProductMutation.isPending}><Archive className="w-4 h-4" /></Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleRestoreProduct(product.id, product.name)} disabled={restoreProductMutation.isPending}><Undo2 className="w-4 h-4" /></Button>
                              <Button size="sm" variant="outline" className="text-destructive border-red-200 hover:bg-red-50" onClick={() => handlePermanentDelete(product.id, product.name)} disabled={permanentDeleteMutation.isPending}><Trash2 className="w-4 h-4" /></Button>
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
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {filteredByMode.length} products
            </div>
          )}
        </CardContent>
      </Card>

      <ViewProductModal 
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
      />
    </>
  );
};

export default ProductsTab;
