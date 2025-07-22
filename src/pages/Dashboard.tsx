
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Package, 
  ShoppingCart, 
  Heart, 
  Settings, 
  LogOut,
  CreditCard,
  MapPin,
  Bell,
  Shield
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useWishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';

const Dashboard = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: orders = [] } = useOrders();
  const { data: wishlistItems = [] } = useWishlist();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Calculate stats from real data
  const totalOrders = orders.length;
  const wishlistCount = wishlistItems.length;
  const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered').length;
  const loyaltyPoints = Math.floor(completedOrders * 20 + totalOrders * 5); // Sample calculation

  const menuItems = [
    {
      title: 'Profile Settings',
      description: 'Manage your personal information',
      icon: User,
      action: () => navigate('/profile'),
      color: 'text-blue-600'
    },
    {
      title: 'My Orders',
      description: 'Track your orders and purchase history',
      icon: Package,
      action: () => navigate('/orders'),
      color: 'text-green-600'
    },
    {
      title: 'Wishlist',
      description: 'View your saved items',
      icon: Heart,
      action: () => navigate('/wishlist'),
      color: 'text-pink-600'
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payment options',
      icon: CreditCard,
      action: () => navigate('/payment-methods'),
      color: 'text-purple-600'
    },
    {
      title: 'Addresses',
      description: 'Manage shipping and billing addresses',
      icon: MapPin,
      action: () => navigate('/addresses'),
      color: 'text-orange-600'
    },
    {
      title: 'Notifications',
      description: 'Control your notification preferences',
      icon: Bell,
      action: () => navigate('/notifications'),
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">{user.email}</p>
              {isAdmin && (
                <Badge className="mt-2 bg-purple-100 text-purple-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>
          
          {isAdmin && !isMobile && (
            <Button 
              onClick={() => navigate('/admin')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Wishlist Items</p>
                  <p className="text-3xl font-bold">{wishlistCount}</p>
                </div>
                <Heart className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Loyalty Points</p>
                  <p className="text-3xl font-bold">{loyaltyPoints}</p>
                </div>
                <Settings className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Summary */}
        {orders.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${Number(order.total_amount).toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {order.status?.replace('_', ' ') || 'pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {orders.length > 3 && (
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/orders')}>
                  View All Orders
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={item.action}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer - Desktop Only */}
      {!isMobile && <Footer />}
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Dashboard;
