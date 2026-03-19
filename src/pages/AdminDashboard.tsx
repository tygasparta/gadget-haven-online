
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

import OverviewTab from '@/components/admin/OverviewTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import UsersTab from '@/components/admin/UsersTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import AddProductModal from '@/components/admin/AddProductModal';
import EditProductModal from '@/components/admin/EditProductModal';
import BulkProductUpload from '@/components/admin/BulkProductUpload';
import StockManagement from '@/components/admin/StockManagement';
import SettingsTab from '@/components/admin/SettingsTab';
import MobileAdminNavigation from '@/components/admin/MobileAdminNavigation';
import MobileProductForm from '@/components/admin/MobileProductForm';
import MobileQuickActions from '@/components/admin/MobileQuickActions';
import MobileOverviewTab from '@/components/admin/MobileOverviewTab';
import BotDashboardTab from '@/components/admin/BotDashboardTab';

import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Upload,
  AlertTriangle,
  Settings,
  ArrowLeft,
  LogOut,
  MessageSquare,
  Store
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'bulk-upload', label: 'Bulk Upload', icon: Upload },
  { id: 'stock', label: 'Stock', icon: AlertTriangle },
  { id: 'whatsapp-bot', label: 'WhatsApp Bot', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileProductForm, setShowMobileProductForm] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  const handleAddProduct = () => {
    if (isMobile) {
      setShowMobileProductForm(true);
    } else {
      setShowAddProductModal(true);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Navigation */}
      {isMobile && (
        <MobileAdminNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddProduct={handleAddProduct}
          isMenuOpen={isMobileMenuOpen}
          onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className={`sticky top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-[68px]' : 'w-60'}`}>
            {/* Logo */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <h2 className="font-bold text-foreground text-sm leading-tight">Gadget Genie</h2>
                  <p className="text-[11px] text-muted-foreground">Admin Panel</p>
                </div>
              )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-border space-y-1">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                title={sidebarCollapsed ? 'Back to Store' : undefined}
              >
                <ArrowLeft className="w-[18px] h-[18px] flex-shrink-0" />
                {!sidebarCollapsed && <span>Back to Store</span>}
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                title={sidebarCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 min-w-0 ${isMobile ? 'pb-20' : ''}`}>
          {/* Top Bar (desktop) */}
          {!isMobile && (
            <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground capitalize">
                  {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your Gadget Genie store
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </header>
          )}

          {/* Tab Content */}
          <div className="p-4 lg:p-6 space-y-6">
            {isMobile && activeTab === 'overview' && (
              <MobileQuickActions
                onAddProduct={handleAddProduct}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === 'overview' && (
              isMobile ? <MobileOverviewTab onTabChange={setActiveTab} /> : <OverviewTab onTabChange={setActiveTab} />
            )}
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
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'whatsapp-bot' && <BotDashboardTab />}
          </div>
        </main>
      </div>

      {/* Modals */}
      {!isMobile && (
        <>
          <AddProductModal
            isOpen={showAddProductModal}
            onClose={() => setShowAddProductModal(false)}
          />
          <EditProductModal
            isOpen={showEditProductModal}
            onClose={() => { setShowEditProductModal(false); setEditingProduct(null); }}
            product={editingProduct}
          />
        </>
      )}

      {isMobile && (
        <MobileProductForm
          isOpen={showMobileProductForm}
          onClose={() => setShowMobileProductForm(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
