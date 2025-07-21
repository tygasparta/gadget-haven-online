
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
  AlertTriangle,
  Store,
  Smartphone
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useUsers } from '@/hooks/useUsers';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import AddProductModal from '@/components/admin/AddProductModal';
import EditProductModal from '@/components/admin/EditProductModal';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import UsersTab from '@/components/admin/UsersTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import SettingsModal from '@/components/admin/SettingsModal';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import OverviewTab from '@/components/admin/OverviewTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const isMobile = useIsMobile();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('AdminDashboard: User:', user?.email);
    console.log('AdminDashboard: Is Admin:', isAdmin);
    console.log('AdminDashboard: Role Loading:', roleLoading);
    console.log('AdminDashboard: Is Mobile:', isMobile);
  }, [user, isAdmin, roleLoading, isMobile]);

  // Block mobile access
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-10 h-10 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Desktop Required</h2>
              <p className="text-gray-300 mb-6">
                The admin dashboard is only available on desktop devices for security and usability reasons.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Store className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Go to Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!roleLoading) {
      if (!user) {
        console.log('AdminDashboard: No user, redirecting to auth');
        navigate('/auth');
      } else if (!isAdmin) {
        console.log('AdminDashboard: User is not admin, redirecting to home');
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges to access this page.",
          variant: "destructive"
        });
        navigate('/');
      } else {
        console.log('AdminDashboard: User is admin, access granted');
      }
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

  const handleBackToStore = () => {
    navigate('/');
  };

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const conversionRate = totalOrders > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBackToStore}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
            >
              <Store className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 mt-1">Manage your Gadget Genie store</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <Button
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-green-500"
              onClick={() => setShowSettings(true)}
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
        {activeTab === 'overview' && <OverviewTab onTabChange={setActiveTab} />}
        {activeTab === 'products' && (
          <ProductsTab 
            onAddProduct={() => setShowAddProduct(true)}
            onEditProduct={setEditingProduct}
          />
        )}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>

      {/* Modals */}
      <AddProductModal 
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
      />
      
      {editingProduct && (
        <EditProductModal 
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default AdminDashboard;
