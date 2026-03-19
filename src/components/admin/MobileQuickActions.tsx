import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, Package, ShoppingCart, Users, Settings, BarChart3, Upload, Bell
} from 'lucide-react';

interface MobileQuickActionsProps {
  onAddProduct: () => void;
  onTabChange: (tab: string) => void;
}

const MobileQuickActions: React.FC<MobileQuickActionsProps> = ({ onAddProduct, onTabChange }) => {
  const quickActions = [
    { icon: Plus, label: 'Add Product', color: 'bg-primary text-primary-foreground', action: onAddProduct },
    { icon: Package, label: 'Products', color: 'bg-accent text-primary', action: () => onTabChange('products') },
    { icon: ShoppingCart, label: 'Orders', color: 'bg-emerald-50 text-emerald-600', action: () => onTabChange('orders') },
    { icon: Users, label: 'Users', color: 'bg-amber-50 text-amber-600', action: () => onTabChange('users') },
    { icon: BarChart3, label: 'Analytics', color: 'bg-rose-50 text-rose-600', action: () => onTabChange('analytics') },
    { icon: Upload, label: 'Upload', color: 'bg-violet-50 text-violet-600', action: () => onTabChange('bulk-upload') },
    { icon: Settings, label: 'Settings', color: 'bg-muted text-muted-foreground', action: () => onTabChange('settings') },
    { icon: Bell, label: 'Alerts', color: 'bg-amber-50 text-amber-600', action: () => {} },
  ];

  return (
    <Card className="border md:hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={action.action}
                className="flex flex-col items-center p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.color} mb-1.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-foreground font-medium text-center leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileQuickActions;
