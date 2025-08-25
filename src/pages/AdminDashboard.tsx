
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Import existing components
import OverviewTab from '@/components/admin/OverviewTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import UsersTab from '@/components/admin/UsersTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import AddProductModal from '@/components/admin/AddProductModal';
import EditProductModal from '@/components/admin/EditProductModal';

// Import new components
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
  ArrowLeft,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950">
      <div className="w-full px-4 py-4">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:mb-8">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-400 flex items-center justify-center space-x-2 w-full sm:w-auto text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Button>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 mt-1 text-sm sm:text-base">Manage your Gadget Genie store</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            {!isMobile && (
              <>
                <Button
                  variant="outline"
                  className="bg-blue-500 hover:bg-blue-600 text-white border-blue-400 flex items-center justify-center space-x-2 text-sm"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </Button>
                <Button
                  variant="outline"
                  className="bg-green-500 hover:bg-green-600 text-white border-green-400 flex items-center justify-center space-x-2 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
              </>
            )}
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="bg-red-500 hover:bg-red-600 text-white border-red-400 flex items-center justify-center space-x-2 text-sm w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 sm:space-x-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 ${
              activeTab === 'overview' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isMobile ? 'hidden' : 'inline'}>Overview</span>
          </Button>
          <Button
            onClick={() => setActiveTab('products')}
            variant={activeTab === 'products' ? 'default' : 'outline'}
            className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 ${
              activeTab === 'products' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isMobile ? 'hidden' : 'inline'}>Products</span>
          </Button>
          <Button
            onClick={() => setActiveTab('orders')}
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 ${
              activeTab === 'orders' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isMobile ? 'hidden' : 'inline'}>Orders</span>
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'outline'}
            className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 ${
              activeTab === 'users' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isMobile ? 'hidden' : 'inline'}>Users</span>
          </Button>
          <Button
            onClick={() => setActiveTab('analytics')}
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 ${
              activeTab === 'analytics' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isMobile ? 'hidden' : 'inline'}>Analytics</span>
          </Button>
          <Button
            onClick={() => setActiveTab('bulk-upload')}
            variant={activeTab === 'bulk-upload' ? 'default' : 'outline'}
            className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 ${
              activeTab === 'bulk-upload' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isMobile ? 'hidden' : 'inline'}>Upload</span>
          </Button>
          <Button
            onClick={() => setActiveTab('stock')}
            variant={activeTab === 'stock' ? 'default' : 'outline'}
            className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 ${
              activeTab === 'stock' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={isMobile ? 'hidden' : 'inline'}>Stock</span>
          </Button>
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
          {activeTab === 'bulk-upload' && <BulkProductUpload />}
          {activeTab === 'stock' && <StockManagement />}
        </div>
      </div>

      {/* Modals */}
      <AddProductModal 
        isOpen={showAddProductModal}
        onClose={handleCloseAddModal}
      />
      <EditProductModal 
        isOpen={showEditProductModal}
        onClose={handleCloseEditModal}
        product={editingProduct}
      />
    </div>
  );
};

export default AdminDashboard;
