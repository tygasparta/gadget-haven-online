import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import MobileAdminCard from './MobileAdminCard';

interface MobileOverviewTabProps {
  onTabChange: (tab: string) => void;
}

const MobileOverviewTab: React.FC<MobileOverviewTabProps> = ({ onTabChange }) => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    recentOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [
        productsRes,
        ordersRes, 
        usersRes,
        lowStockRes,
        pendingOrdersRes,
        recentOrdersRes
      ] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id, total_amount', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('products').select('id').lte('stock', 10),
        supabase.from('orders').select('id').eq('status', 'pending'),
        supabase
          .from('orders')
          .select('id, total_amount, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Calculate total revenue
      const totalRevenue = ordersRes.data?.reduce((sum, order) => 
        sum + parseFloat(String(order.total_amount) || '0'), 0) || 0;

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalRevenue: totalRevenue,
        lowStockProducts: lowStockRes.data?.length || 0,
        pendingOrders: pendingOrdersRes.data?.length || 0,
        recentOrders: recentOrdersRes.data || []
      });

    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">Confirmed</Badge>;
      case 'shipped':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Delivered</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:hidden">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MobileAdminCard
          title="Products"
          value={stats.totalProducts}
          icon={Package}
          color="from-blue-500 to-indigo-500"
          actionLabel="View All"
          onAction={() => onTabChange('products')}
        />
        <MobileAdminCard
          title="Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="from-green-500 to-emerald-500"
          trend={{ value: 12, isPositive: true }}
          actionLabel="View Orders"
          onAction={() => onTabChange('orders')}
        />
        <MobileAdminCard
          title="Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="from-purple-500 to-pink-500"
          trend={{ value: 8, isPositive: true }}
        />
        <MobileAdminCard
          title="Users"
          value={stats.totalUsers}
          icon={Users}
          color="from-orange-500 to-red-500"
          actionLabel="View Users"
          onAction={() => onTabChange('users')}
        />
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.pendingOrders > 0) && (
        <Card className="bg-white/5 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">Low Stock Alert</p>
                    <p className="text-gray-400 text-sm">{stats.lowStockProducts} products low in stock</p>
                  </div>
                </div>
                <Button 
                  onClick={() => onTabChange('stock')}
                  variant="outline" 
                  size="sm"
                  className="bg-orange-500/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/30"
                >
                  Check
                </Button>
              </div>
            )}
            {stats.pendingOrders > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Pending Orders</p>
                    <p className="text-gray-400 text-sm">{stats.pendingOrders} orders awaiting confirmation</p>
                  </div>
                </div>
                <Button 
                  onClick={() => onTabChange('orders')}
                  variant="outline" 
                  size="sm"
                  className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
                >
                  Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg">Recent Orders</CardTitle>
          <Button 
            onClick={() => onTabChange('orders')}
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">#{order.id.substring(0, 8)}</p>
                  <p className="text-gray-400 text-sm">${parseFloat(String(order.total_amount)).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  {getOrderStatusBadge(order.status)}
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No recent orders</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Order Completion Rate</span>
              <span className="text-green-400 font-medium">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Order Value</span>
              <span className="text-blue-400 font-medium">
                ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Products in Stock</span>
              <span className="text-purple-400 font-medium">
                {stats.totalProducts - stats.lowStockProducts}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileOverviewTab;