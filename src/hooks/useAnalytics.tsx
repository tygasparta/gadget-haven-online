
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useUsers } from '@/hooks/useUsers';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  conversionRate: number;
  todaysSales: number;
  pendingOrders: number;
  lowStockItems: number;
  newCustomersToday: number;
  recentOrders: any[];
  salesTrend: any[];
  topProducts: any[];
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
}

export const useAnalytics = () => {
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  return useQuery({
    queryKey: ['analytics', products.length, orders.length, users.length],
    queryFn: async (): Promise<AnalyticsData> => {
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const totalUsers = users.length;
      const conversionRate = totalOrders > 0 ? ((totalOrders / totalUsers) * 100) : 0;

      // Calculate today's sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaysOrders = orders.filter(order => new Date(order.created_at) >= today);
      const todaysSales = todaysOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

      // Pending orders
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      // Low stock items
      const lowStockItems = products.filter(product => (product.stock_quantity || 0) <= 10).length;

      // New customers today
      const newCustomersToday = users.filter(user => 
        user.created_at && new Date(user.created_at) >= today
      ).length;

      // Recent orders (last 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Sales trend (last 6 months)
      const salesTrend = Array.from({ length: 6 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        const monthName = month.toLocaleString('default', { month: 'short' });
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === month.getMonth() && 
                 orderDate.getFullYear() === month.getFullYear();
        });
        
        return {
          month: monthName,
          sales: monthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
          orders: monthOrders.length
        };
      }).reverse();

      // Top products by reviews/sales
      const topProducts = products
        .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        .slice(0, 5)
        .map(product => ({
          name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
          sales: product.reviews || 0,
          revenue: (product.reviews || 0) * product.price
        }));

      // Growth calculations (mock data for now)
      const revenueGrowth = 12.5;
      const orderGrowth = 8.3;
      const userGrowth = 15.2;

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        conversionRate,
        todaysSales,
        pendingOrders,
        lowStockItems,
        newCustomersToday,
        recentOrders,
        salesTrend,
        topProducts,
        revenueGrowth,
        orderGrowth,
        userGrowth
      };
    },
    enabled: products.length > 0 || orders.length > 0 || users.length > 0,
  });
};
