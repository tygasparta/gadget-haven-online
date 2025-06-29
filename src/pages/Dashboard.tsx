
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Package, Star, TrendingUp, Award, Bell, Settings, LogOut, User, CreditCard, MapPin, Download, Filter, Search, Edit, Trash2, Plus, Eye } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(user);
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

  const [recentOrders, setRecentOrders] = useState([
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
  ]);

  const [wishlistItems, setWishlistItems] = useState([
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
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'Your order #ORD-2024-003 has been shipped', time: '2 hours ago', read: false },
    { id: 2, type: 'offer', message: 'Special discount: 20% off on Apple products', time: '1 day ago', read: false },
    { id: 3, type: 'wishlist', message: 'Sony WH-1000XM5 is back in stock', time: '2 days ago', read: true }
  ]);

  const handleSaveProfile = () => {
    setUser(editUser);
    localStorage.setItem('userName', editUser.name);
    localStorage.setItem('userEmail', editUser.email);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
  };

  const handleTrackOrder = (trackingNumber: string) => {
    toast({ title: "Tracking Order", description: `Tracking number: ${trackingNumber}` });
  };

  const handleReorder = (orderId: string) => {
    toast({ title: "Reorder Placed", description: `Reordering items from ${orderId}` });
  };

  const handleAddToCart = (itemId: number) => {
    toast({ title: "Added to Cart", description: "Item has been added to your cart." });
  };

  const handleRemoveFromWishlist = (itemId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Removed from Wishlist", description: "Item has been removed from your wishlist." });
  };

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleRedeemPoints = () => {
    if (user.loyaltyPoints >= 100) {
      setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints - 100 }));
      toast({ title: "Points Redeemed", description: "You've redeemed 100 points for a $10 discount!" });
    } else {
      toast({ title: "Insufficient Points", description: "You need at least 100 points to redeem.", variant: "destructive" });
    }
  };

  const handleExportOrders = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Order ID,Date,Items,Total,Status\n" +
      filteredOrders.map(order => 
        `${order.id},${order.date},"${order.items}",${order.total},${order.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Orders Exported", description: "Your orders have been exported to CSV." });
  };

  const filteredOrders = recentOrders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status.toLowerCase() === orderFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadNotifications = notifications.filter(n => !n.read).length;

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
              { key: 'notifications', label: `Notifications ${unreadNotifications > 0 ? `(${unreadNotifications})` : ''}`, icon: Bell },
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
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
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
                    <Button variant="outline" size="sm" onClick={handleExportOrders}>
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
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Order Details", description: `Viewing details for ${order.id}` })}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleTrackOrder(order.trackingNumber)}>
                          Track Order
                        </Button>
                        {order.status === 'Delivered' && (
                          <Button size="sm" variant="outline" onClick={() => handleReorder(order.id)}>
                            Reorder
                          </Button>
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
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700" 
                          disabled={!item.inStock}
                          onClick={() => handleAddToCart(item.id)}
                        >
                          Add to Cart
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  >
                    Mark All as Read
                  </Button>
                </div>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-colors ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
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
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input 
                        value={isEditing ? editUser.name : user.name} 
                        onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full" 
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input 
                        value={isEditing ? editUser.email : user.email} 
                        onChange={(e) => setEditUser(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full" 
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{user.savedCards} saved payment methods</span>
                      <Button size="sm" variant="outline" className="ml-auto">Manage</Button>
                    </div>
                    <div className="flex-1 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{user.addresses} saved addresses</span>
                      <Button size="sm" variant="outline" className="ml-auto">Manage</Button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex space-x-4">
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
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
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('notifications')}>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                    {unreadNotifications > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadNotifications}
                      </span>
                    )}
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
                
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                  onClick={handleRedeemPoints}
                  disabled={user.loyaltyPoints < 100}
                >
                  Redeem Points
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('orders')}>
                  <Package className="w-4 h-4 mr-2" />
                  Track an Order
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('wishlist')}>
                  <Heart className="w-4 h-4 mr-2" />
                  View Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleExportOrders}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Orders
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
