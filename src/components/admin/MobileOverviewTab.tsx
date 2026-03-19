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
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface MobileOverviewTabProps {
  onTabChange: (tab: string) => void;
}

const MobileOverviewTab: React.FC<MobileOverviewTabProps> = ({ onTabChange }) => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0,
    lowStockProducts: 0, pendingOrders: 0, recentOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardStats(); }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, usersRes, lowStockRes, pendingOrdersRes, recentOrdersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id, total_amount', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('products').select('id').lte('stock', 10),
        supabase.from('orders').select('id').eq('status', 'pending'),
        supabase.from('orders').select('id, total_amount, status, created_at').order('created_at', { ascending: false }).limit(5)
      ]);
      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + parseFloat(String(order.total_amount) || '0'), 0) || 0;
      setStats({
        totalProducts: productsRes.count || 0, totalOrders: ordersRes.count || 0,
        totalUsers: usersRes.count || 0, totalRevenue, lowStockProducts: lowStockRes.data?.length || 0,
        pendingOrders: pendingOrdersRes.data?.length || 0, recentOrders: recentOrdersRes.data || []
      });
    } catch (error: any) {
      toast({ title: "Error loading dashboard", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const metrics = [
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-accent text-primary', action: () => onTabChange('products') },
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600', action: () => onTabChange('orders') },
    { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-violet-50 text-violet-600', action: null },
    { label: 'Users', value: stats.totalUsers, icon: Users, color: 'bg-amber-50 text-amber-600', action: () => onTabChange('users') },
  ];

  return (
    <div className="space-y-5 md:hidden">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} className="border cursor-pointer hover:shadow-md transition-all" onClick={m.action || undefined}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.pendingOrders > 0) && (
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Low Stock</p>
                    <p className="text-xs text-muted-foreground">{stats.lowStockProducts} items</p>
                  </div>
                </div>
                <Button onClick={() => onTabChange('stock')} variant="outline" size="sm" className="text-xs h-7 border-red-200 text-destructive">
                  Check
                </Button>
              </div>
            )}
            {stats.pendingOrders > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Pending</p>
                    <p className="text-xs text-muted-foreground">{stats.pendingOrders} orders</p>
                  </div>
                </div>
                <Button onClick={() => onTabChange('orders')} variant="outline" size="sm" className="text-xs h-7 border-amber-200 text-amber-700">
                  Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-foreground">Recent Orders</CardTitle>
          <Button onClick={() => onTabChange('orders')} variant="ghost" size="sm" className="text-xs text-muted-foreground">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">#{order.id.substring(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">${parseFloat(String(order.total_amount)).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className={getStatusClasses(order.status)}>{order.status}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <div className="text-center py-6">
                <ShoppingCart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No recent orders</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Order Completion Rate', value: '94%', color: 'text-emerald-600' },
              { label: 'Average Order Value', value: `$${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}`, color: 'text-primary' },
              { label: 'Products in Stock', value: String(stats.totalProducts - stats.lowStockProducts), color: 'text-violet-600' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`font-semibold text-sm ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileOverviewTab;
