
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, RefreshCw, Settings } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StockAlert {
  id: number;
  name: string;
  current_stock: number;
  low_stock_threshold: number;
  image: string;
}

const StockManagement: React.FC = () => {
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(false);
  const [reorderQuantity, setReorderQuantity] = useState(50);
  const { data: products = [], refetch } = useProducts();
  const { toast } = useToast();

  const lowStockProducts = products.filter(product => product.stock <= lowStockThreshold);
  const outOfStockProducts = products.filter(product => product.stock === 0);

  const updateStock = async (productId: number, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Stock updated",
        description: "Product stock has been updated successfully",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const bulkUpdateStock = async (productIds: number[], stockChange: number) => {
    try {
      const updates = productIds.map(async (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        const newStock = Math.max(0, product.stock + stockChange);
        return supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', id);
      });

      await Promise.all(updates);

      toast({
        title: "Bulk update completed",
        description: `Updated stock for ${productIds.length} products`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Bulk update failed",
        description: error.message || "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const generateLowStockAlert = () => {
    if (lowStockProducts.length === 0) return null;

    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Low Stock Alert</span>
            <Badge variant="destructive">{lowStockProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-600">Current: {product.stock} units</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Add stock"
                    className="w-20 h-8"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt((e.target as HTMLInputElement).value);
                        if (value > 0) {
                          updateStock(product.id, product.stock + value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => updateStock(product.id, product.stock + reorderQuantity)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Auto Reorder
                  </Button>
                </div>
              </div>
            ))}
            {lowStockProducts.length > 5 && (
              <p className="text-sm text-gray-600">
                +{lowStockProducts.length - 5} more products with low stock
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stock Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Stock Management Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="reorderQuantity">Auto Reorder Quantity</Label>
              <Input
                id="reorderQuantity"
                type="number"
                value={reorderQuantity}
                onChange={(e) => setReorderQuantity(parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setAutoReorderEnabled(!autoReorderEnabled)}
                variant={autoReorderEnabled ? "default" : "outline"}
                className="w-full"
              >
                {autoReorderEnabled ? "Auto Reorder ON" : "Auto Reorder OFF"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
              </div>
              <Package className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(0)}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {generateLowStockAlert()}

      {/* Out of Stock Products */}
      {outOfStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <Package className="w-5 h-5" />
              <span>Out of Stock Products</span>
              <Badge variant="destructive">{outOfStockProducts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-red-600">Out of stock</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => updateStock(product.id, reorderQuantity)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Restock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Stock Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => bulkUpdateStock(lowStockProducts.map(p => p.id), reorderQuantity)}
              disabled={lowStockProducts.length === 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restock All Low Stock
            </Button>
            <Button
              onClick={() => bulkUpdateStock(outOfStockProducts.map(p => p.id), reorderQuantity)}
              disabled={outOfStockProducts.length === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              <Package className="w-4 h-4 mr-2" />
              Restock All Out of Stock
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManagement;
