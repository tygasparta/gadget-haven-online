
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  LogOut, 
  BarChart3,
  Mail
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserRole } from '@/hooks/useUserRole';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';
import OverviewTab from '@/components/admin/OverviewTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import UsersTab from '@/components/admin/UsersTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import EmailManagementTab from '@/components/admin/EmailManagementTab';
import SettingsModal from '@/components/admin/SettingsModal';

const AdminDashboard = () => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: userRole, isLoading: isLoadingRole } = useUserRole();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isLoadingRole && userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [user, userRole, navigate, isLoadingRole]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoadingRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
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
          <div className="flex items-center space-x-3">
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Administrator
            </Badge>
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="products" className="mt-8">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="orders" className="mt-8">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="users" className="mt-8">
            <UsersTab />
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="email" className="mt-8">
            <EmailManagementTab />
          </TabsContent>
        </Tabs>

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default AdminDashboard;
