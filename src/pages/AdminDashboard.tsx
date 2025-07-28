
import React, { useState } from 'react';
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
  Bell
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-100 mt-1">Manage your store and monitor performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30">
              Admin Panel
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </Button>
          <Button
            onClick={() => setActiveTab('products')}
            variant={activeTab === 'products' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'products' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </Button>
          <Button
            onClick={() => setActiveTab('orders')}
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'orders' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders</span>
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'users' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </Button>
          <Button
            onClick={() => setActiveTab('analytics')}
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </Button>
          <Button
            onClick={() => setActiveTab('bulk-upload')}
            variant={activeTab === 'bulk-upload' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'bulk-upload' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload</span>
          </Button>
          <Button
            onClick={() => setActiveTab('stock')}
            variant={activeTab === 'stock' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'stock' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Stock</span>
          </Button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
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

      {!isMobile && <Footer />}
      <MobileNavigation />

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
