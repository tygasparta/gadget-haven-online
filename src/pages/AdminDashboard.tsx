
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Package, DollarSign, TrendingUp, ShoppingCart, Eye, Edit, Trash2, Plus, Search, Filter, Download, Bell, Settings, LogOut, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

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
    userGrowth: 15.2,
    conversionRate: 3.4,
    avgOrderValue: 195
  });

  const [products] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Smartphones',
      price: 1399,
      stock: 45,
      sales: 123,
      status: 'Active',
      rating: 4.8,
      reviews: 456
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      category: 'Laptops',
      price: 999,
      stock: 23,
      sales: 67,
      status: 'Active',
      rating: 4.9,
      reviews: 234
    },
    {
      id: 3,
      name: 'AirPods Pro 2nd Gen',
      category: 'Audio',
      price: 249,
      stock: 89,
      sales: 234,
      status: 'Active',
      rating: 4.7,
      reviews: 678
    },
    {
      id: 4,
      name: 'Samsung Galaxy S24',
      category: 'Smartphones',
      price: 899,
      stock: 12,
      sales: 89,
      status: 'Low Stock',
      rating: 4.6,
      reviews: 345
    },
    {
      id: 5,
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      price: 349,
      stock: 0,
      sales: 156,
      status: 'Out of Stock',
      rating: 4.8,
      reviews: 567
    }
  ]);

  const [recentOrders] = useState([
    {
      id: '#ORD-2024-001',
      customer: 'John Smith',
      email: 'john@example.com',
      total: 1498,
      status: 'Processing',
      date: '2024-01-15',
      items: 2
    },
    {
      id: '#ORD-2024-002',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      total: 999,
      status: 'Shipped',
      date: '2024-01-14',
      items: 1
    },
    {
      id: '#ORD-2024-003',
      customer: 'Mike Chen',
      email: 'mike@example.com',
      total: 299,
      status: 'Delivered',
      date: '2024-01-13',
      items: 1
    },
    {
      id: '#ORD-2024-004',
      customer: 'Emily Davis',
      email: 'emily@example.com',
      total: 1299,
      status: 'Cancelled',
      date: '2024-01-12',
      items: 3
    }
  ]);

  const [users] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      joinDate: '2024-01-01',
      totalOrders: 5,
      totalSpent: 2456,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      joinDate: '2024-01-05',
      totalOrders: 3,
      totalSpent: 1299,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@example.com',
      joinDate: '2024-01-10',
      totalOrders: 8,
      totalSpent: 3456,
      status: 'VIP'
    }
  ]);

  const handleLogout = () => {
    localStorage.clear();
    toast({ title: "Logged out", description: "Admin session ended" });
    navigate('/');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center space-x-3">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-green-100 text-sm flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.revenueGrowth}%
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
                  +{stats.orderGrowth}%
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
                  +{stats.userGrowth}%
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
                  Active inventory
                </p>
              </div>
              <Package className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Conversion Rate</p>
                <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                <p className="text-pink-100 text-sm mt-2">
                  Avg: ${stats.avgOrderValue}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-pink-200" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'products', label: 'Products', icon: Package },
              { key: 'orders', label: 'Orders', icon: ShoppingCart },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === key
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 4).map((order) => (
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
                              : order.status === 'Processing'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
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

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-300">{product.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{product.sales} sales</p>
                          <p className="text-xs text-gray-300">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
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
                      <th className="text-left py-3 px-2">Rating</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-white/10">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.reviews} reviews</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-300">{product.category}</td>
                        <td className="py-3 px-2 font-bold">${product.price}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <span>{product.stock}</span>
                            {product.stock < 20 && product.stock > 0 && (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                            {product.stock === 0 && (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">{product.sales}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{product.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.status === 'Active' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : product.status === 'Low Stock'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white border-0">
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
        )}

        {activeTab === 'orders' && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Management</h2>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-2">Order ID</th>
                      <th className="text-left py-3 px-2">Customer</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Items</th>
                      <th className="text-left py-3 px-2">Total</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-white/10">
                        <td className="py-3 px-2 font-medium">{order.id}</td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-xs text-gray-400">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-300">{order.date}</td>
                        <td className="py-3 px-2">{order.items}</td>
                        <td className="py-3 px-2 font-bold">${order.total}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'Delivered' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : order.status === 'Shipped'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : order.status === 'Processing'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">
                              <Edit className="w-4 h-4" />
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
        )}

        {activeTab === 'users' && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Join Date</th>
                      <th className="text-left py-3 px-2">Orders</th>
                      <th className="text-left py-3 px-2">Total Spent</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white/10">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-300">{user.joinDate}</td>
                        <td className="py-3 px-2">{user.totalOrders}</td>
                        <td className="py-3 px-2 font-bold">${user.totalSpent}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'VIP' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">
                              <Edit className="w-4 h-4" />
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
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Revenue Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">This Month</span>
                    <span className="font-bold text-green-400">$12,456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Last Month</span>
                    <span className="font-bold text-gray-300">$11,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Growth</span>
                    <span className="font-bold text-green-400">+10.9%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Page Views</span>
                    <span className="font-bold text-blue-400">45,678</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Unique Visitors</span>
                    <span className="font-bold text-purple-400">12,345</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Bounce Rate</span>
                    <span className="font-bold text-yellow-400">32.5%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
