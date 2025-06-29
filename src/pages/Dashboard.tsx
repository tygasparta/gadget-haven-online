
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Package, Star, TrendingUp, Award, Bell, Settings, LogOut, User, CreditCard, MapPin, Download, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: localStorage.getItem('userName') || 'John Doe',
    email: localStorage.getItem('userEmail') || 'user@example.com',
    memberSince: '2024',
    totalOrders: 12,
    totalSpent: 2456,
    loyaltyPoints: 340,
    savedCards: 2,
    addresses: 3
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast({ title: "Logged out", description: "See you again soon!" });
    navigate('/');
  };

  const recentOrders = [
    {
      id: '#ORD-2024-001',
      date: '2024-01-15',
      items: 'iPhone 15 Pro, AirPods Pro',
      total: 1498,
      status: 'Delivered',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '#ORD-2024-002',
      date: '2024-01-10',
      items: 'MacBook Air M2',
      total: 999,
      status: 'Delivered',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '#ORD-2024-003',
      date: '2024-01-05',
      items: 'Samsung Galaxy Watch',
      total: 299,
      status: 'In Transit',
      trackingNumber: 'TRK456789123'
    },
    {
      id: '#ORD-2024-004',
      date: '2024-01-01',
      items: 'Sony WH-1000XM5 Headphones',
      total: 349,
      status: 'Processing',
      trackingNumber: 'TRK789123456'
    }
  ];

  const wishlistItems = [
    {
      id: 1,
      name: 'Sony WH-1000XM5',
      price: 349,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
      inStock: true
    },
    {
      id: 2,
      name: 'iPad Pro 12.9"',
      price: 1099,
      originalPrice: 1199,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop',
      inStock: true
    },
    {
      id: 3,
      name: 'MacBook Pro M3',
      price: 1999,
      originalPrice: 2199,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
      inStock: false
    }
  ];

  const notifications = [
    { id: 1, type: 'order', message: 'Your order #ORD-2024-003 has been shipped', time: '2 hours ago' },
    { id: 2, type: 'offer', message: 'Special discount: 20% off on Apple products', time: '1 day ago' },
    { id: 3, type: 'wishlist', message: 'Sony WH-1000XM5 is back in stock', time: '2 days ago' }
  ];

  const filteredOrders = recentOrders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status.toLowerCase() === orderFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-blue-100 mb-6">Here's what's happening with your account</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.totalOrders}</p>
                      <p className="text-blue-100 text-sm">Total Orders</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${user.totalSpent}</p>
                      <p className="text-blue-100 text-sm">Total Spent</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.loyaltyPoints}</p>
                      <p className="text-blue-100 text-sm">Loyalty Points</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{wishlistItems.length}</p>
                      <p className="text-blue-100 text-sm">Wishlist Items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'orders', label: 'Orders', icon: Package },
              { key: 'wishlist', label: 'Wishlist', icon: Heart },
              { key: 'notifications', label: 'Notifications', icon: Bell },
              { key: 'profile', label: 'Profile', icon: User }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === key
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.items}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${order.total}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'orders' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                  <div className="flex items-center space-x-4">
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Orders</option>
                      <option value="delivered">Delivered</option>
                      <option value="in transit">In Transit</option>
                      <option value="processing">Processing</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${order.total}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{order.items}</p>
                      <p className="text-sm text-gray-500 mb-3">Tracking: {order.trackingNumber}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Track Order</Button>
                        {order.status === 'Delivered' && (
                          <Button size="sm" variant="outline">Reorder</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'wishlist' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-lg font-bold text-blue-600">${item.price}</p>
                          {item.originalPrice > item.price && (
                            <p className="text-sm text-gray-500 line-through">${item.originalPrice}</p>
                          )}
                        </div>
                        <p className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={!item.inStock}>
                          Add to Cart
                        </Button>
                        <Button size="sm" variant="outline">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'order' ? 'bg-blue-100' :
                        notification.type === 'offer' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {notification.type === 'order' ? <Package className="w-5 h-5 text-blue-600" /> :
                         notification.type === 'offer' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                         <Heart className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input value={user.name} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input value={user.email} className="w-full" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{user.savedCards} saved payment methods</span>
                    </div>
                    <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{user.addresses} saved addresses</span>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {user.memberSince}</p>
                
                <div className="mt-6 space-y-3">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </Card>

            {/* Loyalty Program */}
            <Card className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gold Member</h3>
                <p className="text-2xl font-bold text-orange-600 mb-2">{user.loyaltyPoints} Points</p>
                <p className="text-sm text-gray-600 mb-4">160 points until Platinum status</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                  Redeem Points
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Track an Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  View Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
