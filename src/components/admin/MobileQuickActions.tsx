import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  Upload,
  Bell
} from 'lucide-react';

interface MobileQuickActionsProps {
  onAddProduct: () => void;
  onTabChange: (tab: string) => void;
}

const MobileQuickActions: React.FC<MobileQuickActionsProps> = ({
  onAddProduct,
  onTabChange
}) => {
  const quickActions = [
    {
      icon: Plus,
      label: 'Add Product',
      color: 'from-purple-500 to-blue-500',
      action: onAddProduct
    },
    {
      icon: Package,
      label: 'Products',
      color: 'from-blue-500 to-indigo-500',
      action: () => onTabChange('products')
    },
    {
      icon: ShoppingCart,
      label: 'Orders',
      color: 'from-green-500 to-emerald-500',
      action: () => onTabChange('orders')
    },
    {
      icon: Users,
      label: 'Users',
      color: 'from-orange-500 to-red-500',
      action: () => onTabChange('users')
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      color: 'from-pink-500 to-rose-500',
      action: () => onTabChange('analytics')
    },
    {
      icon: Upload,
      label: 'Upload',
      color: 'from-indigo-500 to-purple-500',
      action: () => onTabChange('bulk-upload')
    },
    {
      icon: Settings,
      label: 'Settings',
      color: 'from-gray-500 to-slate-500',
      action: () => onTabChange('settings')
    },
    {
      icon: Bell,
      label: 'Notifications',
      color: 'from-yellow-500 to-amber-500',
      action: () => {} // Placeholder
    }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/20 md:hidden">
      <CardHeader>
        <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                variant="ghost"
                className="h-auto flex flex-col items-center p-3 space-y-2 hover:bg-white/10 rounded-xl"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-white font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileQuickActions;