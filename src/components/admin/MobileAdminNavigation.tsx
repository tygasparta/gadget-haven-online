import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Menu
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
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { id: 'products', label: 'Products', icon: Package, color: 'from-purple-500 to-purple-600' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'from-green-500 to-green-600' },
    { id: 'users', label: 'Users', icon: Users, color: 'from-orange-500 to-orange-600' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'from-pink-500 to-pink-600' },
    { id: 'bulk-upload', label: 'Upload', icon: Upload, color: 'from-indigo-500 to-indigo-600' },
    { id: 'stock', label: 'Stock', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-gray-600' }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          onClick={onToggleMenu}
          variant="outline"
          size="sm"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onToggleMenu} />
          <div className="absolute left-0 top-0 h-full w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Admin Menu</h2>
              <div className="space-y-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        onToggleMenu();
                      }}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start text-left ${
                        isActive 
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Add Product */}
      <div className="fixed bottom-6 right-6 z-30 md:hidden">
        <Button
          onClick={onAddProduct}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20 md:hidden z-20">
        <div className="flex justify-around items-center py-2">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 p-2 ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileAdminNavigation;