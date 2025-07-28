
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';

// Import existing components
import OverviewTab from '@/components/admin/OverviewTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import UsersTab from '@/components/admin/UsersTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import AddProductModal from '@/components/admin/AddProductModal';
import EditProductModal from '@/components/admin/EditProductModal';
import BulkProductUpload from '@/components/admin/BulkProductUpload';
import StockManagement from '@/components/admin/StockManagement';

import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Upload,
  AlertTriangle,
  Settings,
  Bell,
  LogOut,
  Store
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddProductModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditProductModal(false);
    setEditingProduct(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800/50 to-blue-900/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
              >
                <Store className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm">Manage your Gadget Genie store</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant="outline"
                className="bg-green-600 hover:bg-green-700 border-green-500 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 border-red-500 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
              className={`${activeTab === 'overview' 
                ? 'bg-white text-purple-700 hover:bg-gray-100' 
                : 'bg-purple-800/50 text-white border-purple-400 hover:bg-purple-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'outline'}
              onClick={() => setActiveTab('products')}
              className={`${activeTab === 'products' 
                ? 'bg-white text-purple-700 hover:bg-gray-100' 
                : 'bg-purple-800/50 text-white border-purple-400 hover:bg-purple-700/50'
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('orders')}
              className={`${activeTab === 'orders' 
                ? 'bg-white text-purple-700 hover:bg-gray-100' 
                : 'bg-purple-800/50 text-white border-purple-400 hover:bg-purple-700/50'
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users' 
                ? 'bg-white text-purple-700 hover:bg-gray-100' 
                : 'bg-purple-800/50 text-white border-purple-400 hover:bg-purple-700/50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
              className={`${activeTab === 'analytics' 
                ? 'bg-white text-purple-700 hover:bg-gray-100' 
                : 'bg-purple-800/50 text-white border-purple-400 hover:bg-purple-700/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab onTabChange={setActiveTab} />}
          {activeTab === 'products' && (
            <ProductsTab 
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
            />
          )}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>

      {/* Product Modals */}
      <AddProductModal 
        isOpen={showAddProductModal}
        onClose={handleCloseAddModal}
      />
      
      <EditProductModal 
        isOpen={showEditProductModal}
        product={editingProduct}
        onClose={handleCloseEditModal}
      />

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default AdminDashboard;
