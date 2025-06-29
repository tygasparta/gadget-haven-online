
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Package, DollarSign, TrendingUp, ShoppingCart, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    if (!isAuth || userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const [stats] = useState({
    totalRevenue: 45678,
    totalOrders: 234,
    totalUsers: 1567,
    totalProducts: 89,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    userGrowth: 15.2
  });

  const [products] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Smartphones',
      price: 1399,
      stock: 45,
      sales: 123,
      status: 'Active'
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      category: 'Laptops',
      price: 999,
      stock: 23,
      sales: 67,
      status: 'Active'
    },
    {
      id: 3,
      name: 'AirPods Pro 2nd Gen',
      category: 'Audio',
      price: 249,
      stock: 89,
      sales: 234,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Samsung Galaxy S24',
      category: 'Smartphones',
      price: 899,
      stock: 12,
      sales: 89,
      status: 'Low Stock'
    }
  ]);

  const [recentOrders] = useState([
    {
      id: '#ORD-2024-001',
      customer: 'John Smith',
      total: 1498,
      status: 'Processing',
      date: '2024-01-15'
    },
    {
      id: '#ORD-2024-002',
      customer: 'Sarah Johnson',
      total: 999,
      status: 'Shipped',
      date: '2024-01-14'
    },
    {
      id: '#ORD-2024-003',
      customer: 'Mike Chen',
      total: 299,
      status: 'Delivered',
      date: '2024-01-13'
    }
  ]);

  const handleLogout = () => {
    localStorage.clear();
    toast({ title: "Logged out", description: "Admin session ended" });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your Gadget Genie store</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-green-100 text-sm flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.revenueGrowth}% from last month
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <p className="text-blue-100 text-sm flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.orderGrowth}% from last month
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-purple-100 text-sm flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.userGrowth}% from last month
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Products</p>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
                <p className="text-orange-100 text-sm mt-2">
                  Active inventory items
                </p>
              </div>
              <Package className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Management */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Product Management</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-2">Product</th>
                        <th className="text-left py-3 px-2">Category</th>
                        <th className="text-left py-3 px-2">Price</th>
                        <th className="text-left py-3 px-2">Stock</th>
                        <th className="text-left py-3 px-2">Sales</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-white/10">
                          <td className="py-3 px-2 font-medium">{product.name}</td>
                          <td className="py-3 px-2 text-gray-300">{product.category}</td>
                          <td className="py-3 px-2">${product.price}</td>
                          <td className="py-3 px-2">{product.stock}</td>
                          <td className="py-3 px-2">{product.sales}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.status === 'Active' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Orders & Analytics */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-300">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          order.status === 'Delivered' 
                            ? 'bg-green-500/20 text-green-300'
                            : order.status === 'Shipped'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Today's Sales</span>
                    <span className="font-bold text-green-400">$2,345</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Pending Orders</span>
                    <span className="font-bold text-yellow-400">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Low Stock Items</span>
                    <span className="font-bold text-red-400">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">New Customers</span>
                    <span className="font-bold text-blue-400">8</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
