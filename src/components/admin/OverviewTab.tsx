
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  UserPlus,
  ArrowUpRight,
  ArrowDownRight
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
    if (onTabChange) {
      onTabChange('products');
      toast({ title: "Low Stock Review", description: "Switched to Products tab to review low stock items" });
    }
  };

  const handleProcessPendingOrders = () => {
    if (onTabChange) {
      onTabChange('orders');
      toast({ title: "Processing Orders", description: "Switched to Orders tab to process pending orders" });
    }
  };

  const handleWelcomeNewCustomers = async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const { data: newUsers, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .gte('created_at', yesterday.toISOString())
        .limit(10);

      if (error) {
        toast({ title: "Error", description: "Failed to fetch new customers", variant: "destructive" });
        return;
      }

      if (newUsers && newUsers.length > 0) {
        const notifications = newUsers.map(user => ({
          user_id: user.id,
          title: 'Welcome to Gadget Genie!',
          message: `Hello ${user.full_name || 'valued customer'}! Thank you for joining us.`,
          type: 'welcome'
        }));
        const { error: notificationError } = await supabase.from('notifications').insert(notifications);
        if (notificationError) {
          toast({ title: "Partial Success", description: `Found ${newUsers.length} new customers, but couldn't send all welcome messages`, variant: "destructive" });
        } else {
          toast({ title: "Welcome Messages Sent!", description: `Successfully sent welcome messages to ${newUsers.length} new customers` });
        }
      } else {
        toast({ title: "No New Customers", description: "No new customers found in the last 24 hours" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to process welcome messages", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center text-muted-foreground py-8">No analytics data available</div>;
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: `+${analytics.revenueGrowth}%`,
      isPositive: true,
      icon: DollarSign,
      onClick: () => onTabChange?.('analytics'),
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders,
      change: `+${analytics.orderGrowth}%`,
      isPositive: true,
      icon: ShoppingCart,
      onClick: () => onTabChange?.('orders'),
      accent: 'text-primary bg-accent border-border',
      iconBg: 'bg-accent text-primary',
    },
    {
      label: 'Total Users',
      value: analytics.totalUsers,
      change: `+${analytics.userGrowth}%`,
      isPositive: true,
      icon: Users,
      onClick: () => onTabChange?.('users'),
      accent: 'text-violet-600 bg-violet-50 border-violet-100',
      iconBg: 'bg-violet-100 text-violet-600',
    },
    {
      label: 'Total Products',
      value: analytics.totalProducts,
      change: 'Active',
      isPositive: true,
      icon: Package,
      onClick: () => onTabChange?.('products'),
      accent: 'text-amber-600 bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Conversion Rate',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      change: 'Avg: $195',
      isPositive: true,
      icon: TrendingUp,
      onClick: () => onTabChange?.('analytics'),
      accent: 'text-rose-600 bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-100 text-rose-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border"
              onClick={stat.onClick}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border cursor-pointer hover:shadow-md transition-all" onClick={() => onTabChange?.('analytics')}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Sales</p>
              <p className="text-xl font-bold text-emerald-600">${analytics.todaysSales.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border cursor-pointer hover:shadow-md transition-all" onClick={handleProcessPendingOrders}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-xl font-bold text-amber-600">{analytics.pendingOrders}</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border cursor-pointer hover:shadow-md transition-all" onClick={handleReviewLowStock}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-xl font-bold text-destructive">{analytics.lowStockItems}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border cursor-pointer hover:shadow-md transition-all" onClick={() => onTabChange?.('users')}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Customers</p>
              <p className="text-xl font-bold text-primary">{analytics.newCustomersToday}</p>
            </div>
            <div className="p-2 rounded-lg bg-accent">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Recent Orders</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange?.('orders')}
              className="text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground text-sm">#ORD-{order.id.slice(-8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <p className="font-semibold text-foreground text-sm">${Number(order.total_amount).toFixed(2)}</p>
                  <Badge
                    variant="secondary"
                    className={
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-amber-100 text-amber-700 border-amber-200'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
            {analytics.recentOrders.length === 0 && (
              <p className="text-muted-foreground text-center py-6 text-sm">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Alerts & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.lowStockItems > 0 && (
              <div className="flex items-center p-3 bg-red-50 border border-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-destructive text-sm">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">{analytics.lowStockItems} products running low</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-red-200 text-destructive hover:bg-red-50" onClick={handleReviewLowStock}>
                  Review
                </Button>
              </div>
            )}

            {analytics.pendingOrders > 0 && (
              <div className="flex items-center p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-amber-700 text-sm">Pending Orders</p>
                  <p className="text-xs text-muted-foreground">{analytics.pendingOrders} orders need attention</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-amber-200 text-amber-700 hover:bg-amber-50" onClick={handleProcessPendingOrders}>
                  Process
                </Button>
              </div>
            )}

            {analytics.newCustomersToday > 0 && (
              <div className="flex items-center p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <UserPlus className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-emerald-700 text-sm">New Customers</p>
                  <p className="text-xs text-muted-foreground">{analytics.newCustomersToday} joined today</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={handleWelcomeNewCustomers}>
                  Welcome
                </Button>
              </div>
            )}

            {analytics.lowStockItems === 0 && analytics.pendingOrders === 0 && analytics.newCustomersToday === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="font-medium">All systems running smoothly!</p>
                <p className="text-sm mt-1">No immediate actions required.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
