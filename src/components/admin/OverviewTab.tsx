
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp,
  Eye,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToast } from '@/hooks/use-toast';

interface OverviewTabProps {
  onTabChange?: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onTabChange }) => {
  const { data: analytics, isLoading } = useAnalytics();
  const { toast } = useToast();

  const handleReviewLowStock = () => {
    console.log('Review Low Stock clicked');
    if (onTabChange) {
      onTabChange('products');
      toast({
        title: "Low Stock Review",
        description: "Switched to Products tab to review low stock items",
      });
    }
  };

  const handleProcessPendingOrders = () => {
    console.log('Process Pending Orders clicked');
    if (onTabChange) {
      onTabChange('orders');
      toast({
        title: "Processing Orders",
        description: "Switched to Orders tab to process pending orders",
      });
    }
  };

  const handleViewAllOrders = () => {
    if (onTabChange) {
      onTabChange('orders');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-white py-8">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-green-100 text-sm mt-1">↗ +{analytics.revenueGrowth}%</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold">{analytics.totalOrders}</p>
                <p className="text-blue-100 text-sm mt-1">↗ +{analytics.orderGrowth}%</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{analytics.totalUsers}</p>
                <p className="text-purple-100 text-sm mt-1">↗ +{analytics.userGrowth}%</p>
              </div>
              <Users className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold">{analytics.totalProducts}</p>
                <p className="text-orange-100 text-sm mt-1">Active inventory</p>
              </div>
              <Package className="w-12 h-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 border-none text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                <p className="text-pink-100 text-sm mt-1">Avg: $195</p>
              </div>
              <TrendingUp className="w-12 h-12 text-pink-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-purple-800/50 backdrop-blur-sm border-purple-400/30 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Today's Sales</p>
                <p className="text-2xl font-bold text-green-400">
                  ${analytics.todaysSales.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-800/50 backdrop-blur-sm border-purple-400/30 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-400">{analytics.pendingOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-800/50 backdrop-blur-sm border-purple-400/30 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-400">{analytics.lowStockItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-800/50 backdrop-blur-sm border-purple-400/30 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">New Customers</p>
                <p className="text-2xl font-bold text-blue-400">{analytics.newCustomersToday}</p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-purple-800/50 backdrop-blur-sm border-purple-400/30 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Recent Orders</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
                onClick={handleViewAllOrders}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {analytics.recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-purple-900/30 rounded-lg border border-purple-400/20">
                  <div>
                    <p className="font-medium text-white">#ORD-{order.id.slice(-8)}</p>
                    <p className="text-sm text-purple-200">User: {order.user_id.slice(-8)}</p>
                    <p className="text-xs text-purple-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${Number(order.total_amount).toFixed(2)}</p>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        order.status === 'completed' ? 'bg-green-600 text-white border-green-500' : 
                        order.status === 'shipped' ? 'bg-blue-600 text-white border-blue-500' : 
                        'bg-orange-600 text-white border-orange-500'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {analytics.recentOrders.length === 0 && (
                <p className="text-purple-300 text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-800/50 backdrop-blur-sm border-purple-400/30 text-white">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Actions & Alerts</h3>
            <div className="space-y-4">
              {analytics.lowStockItems > 0 && (
                <div className="flex items-center p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-300">Low Stock Alert</p>
                    <p className="text-sm text-red-200">
                      {analytics.lowStockItems} products are running low on stock
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-red-600 hover:bg-red-700 border-red-500 text-white"
                    onClick={handleReviewLowStock}
                  >
                    Review
                  </Button>
                </div>
              )}
              
              {analytics.pendingOrders > 0 && (
                <div className="flex items-center p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-300">Pending Orders</p>
                    <p className="text-sm text-yellow-200">
                      {analytics.pendingOrders} orders need your attention
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-yellow-600 hover:bg-yellow-700 border-yellow-500 text-white"
                    onClick={handleProcessPendingOrders}
                  >
                    Process
                  </Button>
                </div>
              )}

              {analytics.lowStockItems === 0 && analytics.pendingOrders === 0 && (
                <div className="text-center py-8 text-purple-300">
                  <p>All systems running smoothly!</p>
                  <p className="text-sm mt-2">No immediate actions required.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
