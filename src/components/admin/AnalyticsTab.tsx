
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useUsers } from '@/hooks/useUsers';

const AnalyticsTab = () => {
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  // Mock data for charts - in real app, this would come from analytics queries
  const salesData = [
    { month: 'Jan', sales: 12000, orders: 45 },
    { month: 'Feb', sales: 19000, orders: 67 },
    { month: 'Mar', sales: 15000, orders: 52 },
    { month: 'Apr', sales: 22000, orders: 78 },
    { month: 'May', sales: 18000, orders: 61 },
    { month: 'Jun', sales: 25000, orders: 89 },
  ];

  const categoryData = [
    { name: 'Smartphones', value: 45, color: '#8884d8' },
    { name: 'Audio', value: 25, color: '#82ca9d' },
    { name: 'Accessories', value: 20, color: '#ffc658' },
    { name: 'Other', value: 10, color: '#ff7300' },
  ];

  const topProducts = products
    .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    .slice(0, 5)
    .map(product => ({
      name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
      sales: product.reviews || 0,
      revenue: (product.reviews || 0) * product.price
    }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                ${orders.reduce((sum, order) => sum + Number(order.total_amount), 0).toLocaleString()}
              </p>
              <p className="text-gray-300 text-sm">Total Revenue</p>
              <p className="text-green-400 text-xs">↗ +12.5%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{orders.length}</p>
              <p className="text-gray-300 text-sm">Total Orders</p>
              <p className="text-blue-400 text-xs">↗ +8.3%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{users.length}</p>
              <p className="text-gray-300 text-sm">Active Users</p>
              <p className="text-purple-400 text-xs">↗ +15.2%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {orders.length > 0 ? ((orders.length / users.length) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-gray-300 text-sm">Conversion Rate</p>
              <p className="text-orange-400 text-xs">↗ +3.1%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order, index) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Order #{order.id.slice(-8)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${Number(order.total_amount).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
