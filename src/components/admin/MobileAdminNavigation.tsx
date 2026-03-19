import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Upload,
  AlertTriangle,
  Settings,
  Plus,
  Menu,
  X,
  MessageSquare,
  Store
} from 'lucide-react';

interface MobileAdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddProduct: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

const MobileAdminNavigation: React.FC<MobileAdminNavigationProps> = ({
  activeTab,
  onTabChange,
  onAddProduct,
  isMenuOpen,
  onToggleMenu
}) => {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'bulk-upload', label: 'Upload', icon: Upload },
    { id: 'stock', label: 'Stock', icon: AlertTriangle },
    { id: 'whatsapp-bot', label: 'WhatsApp Bot', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const bottomNavItems = navigationItems.slice(0, 4);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-50 md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={onToggleMenu} variant="ghost" size="icon" className="text-foreground">
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">Admin</span>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onToggleMenu} />
          <div className="absolute left-0 top-0 h-full w-72 bg-card shadow-xl border-r border-border">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-sm">Gadget Genie</h2>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); onToggleMenu(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-20 right-4 z-30 md:hidden">
        <Button
          onClick={onAddProduct}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </Button>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-20 safe-area-pb">
        <div className="flex justify-around items-center py-1.5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileAdminNavigation;
