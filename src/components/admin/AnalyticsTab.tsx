
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useUsers } from '@/hooks/useUsers';
import {
  DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpRight, Package
} from 'lucide-react';

const CHART_COLORS = {
  primary: 'hsl(201, 91%, 40%)',
  emerald: '#10b981',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  sky: '#0ea5e9',
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.emerald, CHART_COLORS.amber, CHART_COLORS.violet, CHART_COLORS.rose, CHART_COLORS.sky];

const tooltipStyle = {
  backgroundColor: 'hsl(0, 0%, 100%)',
  border: '1px solid hsl(214, 32%, 88%)',
  borderRadius: '8px',
  color: 'hsl(217, 50%, 10%)',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const AnalyticsTab = () => {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  // Build category data from real products
  const categoryMap: Record<string, number> = {};
  products.forEach(p => {
    const cat = p.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }));

  // Order status breakdown
  const statusMap: Record<string, number> = {};
  orders.forEach(o => {
    const s = o.status || 'unknown';
    statusMap[s] = (statusMap[s] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value], i) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Daily orders for last 14 days
  const dailyOrders = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayOrders = orders.filter(o => {
      const od = new Date(o.created_at);
      return od >= d && od < nextDay;
    });
    return {
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + Number(o.total_amount), 0),
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);

  const metrics = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: `+${analytics?.revenueGrowth || 0}%`, icon: DollarSign, iconBg: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Orders', value: orders.length, change: `+${analytics?.orderGrowth || 0}%`, icon: ShoppingCart, iconBg: 'bg-accent text-primary' },
    { label: 'Active Users', value: users.length, change: `+${analytics?.userGrowth || 0}%`, icon: Users, iconBg: 'bg-violet-100 text-violet-600' },
    { label: 'Conversion Rate', value: `${users.length > 0 ? ((orders.length / users.length) * 100).toFixed(1) : 0}%`, change: '+3.1%', icon: TrendingUp, iconBg: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} className="border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${m.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {m.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Area Chart + Daily Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Revenue Trend</CardTitle>
            <CardDescription>Last 14 days revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyOrders}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="date" stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Daily Orders</CardTitle>
            <CardDescription>Last 14 days order count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="date" stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="orders" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales + Category Pie + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Trend */}
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Monthly Sales</CardTitle>
            <CardDescription>Revenue & orders by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analytics?.salesTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke={CHART_COLORS.emerald} strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke={CHART_COLORS.violet} strokeWidth={2} dot={{ r: 3 }} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Product Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Order Status</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {statusData.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name} ({s.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Top Products</CardTitle>
            <CardDescription>By number of reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics?.topProducts || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis type="number" stroke="hsl(215, 16%, 47%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(215, 16%, 47%)" fontSize={11} width={100} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sales" fill={CHART_COLORS.emerald} radius={[0, 4, 4, 0]} barSize={18} name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0, 6).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">#{order.id.slice(-8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">${Number(order.total_amount).toFixed(2)}</p>
                    <Badge
                      variant="secondary"
                      className={
                        order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-muted text-muted-foreground'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-muted-foreground text-center py-6 text-sm">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
