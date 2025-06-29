
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import AddProductModal from '@/components/admin/AddProductModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!user && !roleLoading) {
      navigate('/auth');
    } else if (user && !isAdmin && !roleLoading) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges to access this page.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, isAdmin, roleLoading, navigate, toast]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "The product has been removed from the catalog"
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = 1567; // Mock data as we don't have user count
  const conversionRate = 3.4; // Mock data

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = products.filter(product => product.stock <= 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">Manage your Gadget Genie store</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="ml-2">3</Badge>
            </Button>
            <Button
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-green-500"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 border-none text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-green-100 text-sm mt-1">↗ +12.5%</p>
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
                  <p className="text-3xl font-bold">{totalOrders}</p>
                  <p className="text-blue-100 text-sm mt-1">↗ +8.3%</p>
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
                  <p className="text-3xl font-bold">{totalUsers}</p>
                  <p className="text-purple-100 text-sm mt-1">↗ +15.2%</p>
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
                  <p className="text-3xl font-bold">{totalProducts}</p>
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
                  <p className="text-3xl font-bold">{conversionRate}%</p>
                  <p className="text-pink-100 text-sm mt-1">Avg: $195</p>
                </div>
                <BarChart3 className="w-12 h-12 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`${
                activeTab === tab.id 
                  ? "bg-white text-gray-900 hover:bg-gray-100" 
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 4).map((order, index) => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">#ORD-2024-{String(index + 1).padStart(3, '0')}</p>
                        <p className="text-sm text-gray-300">Customer Name</p>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total_amount}</p>
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
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Today's Sales</span>
                    <span className="text-green-400 font-bold">$2,345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pending Orders</span>
                    <span className="text-yellow-400 font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Low Stock Items</span>
                    <span className="text-red-400 font-bold">{lowStockItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">New Customers</span>
                    <span className="text-blue-400 font-bold">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
          <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Product Management</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 text-gray-300">Product</th>
                      <th className="text-left p-4 text-gray-300">Category</th>
                      <th className="text-left p-4 text-gray-300">Price</th>
                      <th className="text-left p-4 text-gray-300">Stock</th>
                      <th className="text-left p-4 text-gray-300">Sales</th>
                      <th className="text-left p-4 text-gray-300">Rating</th>
                      <th className="text-left p-4 text-gray-300">Status</th>
                      <th className="text-left p-4 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                              }}
                            />
                            <div>
                              <p className="font-medium text-white">{product.name}</p>
                              <p className="text-sm text-gray-400">{product.reviews} reviews</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{product.category}</td>
                        <td className="p-4 text-white font-medium">${product.price}</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <span className="text-white">{product.stock}</span>
                            {product.stock <= 10 && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-white">{product.reviews}</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white ml-1">{product.rating}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={product.stock > 10 ? 'default' : 'secondary'}
                            className={product.stock > 10 ? 'bg-green-600' : 'bg-orange-600'}
                          >
                            {product.stock > 10 ? 'Active' : 'Low Stock'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="bg-blue-600 hover:bg-blue-700 border-blue-500">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-green-600 hover:bg-green-700 border-green-500">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-red-600 hover:bg-red-700 border-red-500"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
      />
    </div>
  );
};

export default AdminDashboard;
