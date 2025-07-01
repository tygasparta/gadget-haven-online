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
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface OverviewTabProps {
  onTabChange?: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onTabChange }) => {
  const { data: analytics, isLoading } = useAnalytics();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleWelcomeNewCustomers = async () => {
    console.log('Welcome New Customers clicked');
    try {
      // Get new users from the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: newUsers, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .gte('created_at', yesterday.toISOString())
        .limit(10);

      if (error) {
        console.error('Error fetching new users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch new customers",
          variant: "destructive"
        });
        return;
      }

      if (newUsers && newUsers.length > 0) {
        // Create welcome notifications for new customers
        const notifications = newUsers.map(user => ({
          user_id: user.id,
          title: 'Welcome to Gadget Genie!',
          message: `Hello ${user.full_name || 'valued customer'}! Thank you for joining us. Explore our amazing deals and products. Enjoy exclusive offers and premium support!`,
          type: 'welcome'
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) {
          console.error('Error creating notifications:', notificationError);
          toast({
            title: "Partial Success",
            description: `Found ${newUsers.length} new customers, but couldn't send all welcome messages`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome Messages Sent!",
            description: `Successfully sent welcome messages to ${newUsers.length} new customers`,
          });
        }
      } else {
        toast({
          title: "No New Customers",
          description: "No new customers found in the last 24 hours",
        });
      }
    } catch (error) {
      console.error('Error in handleWelcomeNewCustomers:', error);
      toast({
        title: "Error",
        description: "Failed to process welcome messages",
        variant: "destructive"
      });
    }
  };

  const handleViewAllOrders = () => {
    if (onTabChange) {
      onTabChange('orders');
    }
  };

  const handleViewProducts = () => {
    if (onTabChange) {
      onTabChange('products');
    }
  };

  const handleViewUsers = () => {
    if (onTabChange) {
      onTabChange('users');
    }
  };

  const handleViewAnalytics = () => {
    if (onTabChange) {
      onTabChange('analytics');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-400 py-8">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 border-none text-white cursor-pointer hover:scale-105 transition-transform" onClick={handleViewAnalytics}>
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
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white cursor-pointer hover:scale-105 transition-transform" onClick={handleViewAllOrders}>
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
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 border-none text-white cursor-pointer hover:scale-105 transition-transform" onClick={handleViewUsers}>
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
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-none text-white cursor-pointer hover:scale-105 transition-transform" onClick={handleViewProducts}>
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
        
        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 border-none text-white cursor-pointer hover:scale-105 transition-transform" onClick={handleViewAnalytics}>
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
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white cursor-pointer hover:bg-black/30 transition-colors" onClick={handleViewAnalytics}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Today's Sales</p>
                <p className="text-2xl font-bold text-green-400">
                  ${analytics.todaysSales.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white cursor-pointer hover:bg-black/30 transition-colors" onClick={handleProcessPendingOrders}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-400">{analytics.pendingOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white cursor-pointer hover:bg-black/30 transition-colors" onClick={handleReviewLowStock}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-400">{analytics.lowStockItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white cursor-pointer hover:bg-black/30 transition-colors" onClick={handleViewUsers}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">New Customers</p>
                <p className="text-2xl font-bold text-blue-400">{analytics.newCustomersToday}</p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Recent Orders</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 border-blue-500"
                onClick={handleViewAllOrders}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {analytics.recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">#ORD-{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-300">User: {order.user_id.slice(-8)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${Number(order.total_amount).toFixed(2)}</p>
                    <Badge 
                      variant={order.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        order.status === 'completed' ? 'bg-green-600' : 
                        order.status === 'shipped' ? 'bg-blue-600' : 'bg-orange-600'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {analytics.recentOrders.length === 0 && (
                <p className="text-gray-400 text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions & Alerts</h3>
            <div className="space-y-4">
              {analytics.lowStockItems > 0 && (
                <div className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-400">Low Stock Alert</p>
                    <p className="text-sm text-gray-300">
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
                <div className="flex items-center p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-400">Pending Orders</p>
                    <p className="text-sm text-gray-300">
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

              {analytics.newCustomersToday > 0 && (
                <div className="flex items-center p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <UserPlus className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-green-400">New Customers</p>
                    <p className="text-sm text-gray-300">
                      {analytics.newCustomersToday} new customers joined today
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-green-600 hover:bg-green-700 border-green-500 text-white"
                    onClick={handleWelcomeNewCustomers}
                  >
                    Welcome
                  </Button>
                </div>
              )}

              {analytics.lowStockItems === 0 && analytics.pendingOrders === 0 && analytics.newCustomersToday === 0 && (
                <div className="text-center py-8 text-gray-400">
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
