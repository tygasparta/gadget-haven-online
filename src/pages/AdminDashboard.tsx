
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

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your store and monitor performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <Badge className="bg-blue-100 text-blue-800">
              Admin Panel
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-7'} bg-white rounded-lg shadow-sm`}>
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              {!isMobile && <span>Overview</span>}
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              {!isMobile && <span>Products</span>}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              {!isMobile && <span>Orders</span>}
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="users" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="bulk-upload" className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Bulk Upload</span>
                </TabsTrigger>
                <TabsTrigger value="stock" className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Stock</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Mobile additional tabs */}
          {isMobile && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={activeTab === 'users' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('users')}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Users</span>
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('analytics')}
                className="flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </Button>
              <Button
                variant={activeTab === 'bulk-upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('bulk-upload')}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Bulk Upload</span>
              </Button>
              <Button
                variant={activeTab === 'stock' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('stock')}
                className="flex items-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Stock</span>
              </Button>
            </div>
          )}

          {/* Tab Contents */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="bulk-upload" className="space-y-6">
            <BulkProductUpload />
          </TabsContent>

          <TabsContent value="stock" className="space-y-6">
            <StockManagement />
          </TabsContent>
        </Tabs>
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default AdminDashboard;
