import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MobileAdminCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color: string;
  trend?: { value: number; isPositive: boolean };
  actionLabel?: string;
  onAction?: () => void;
}

const MobileAdminCard: React.FC<MobileAdminCardProps> = ({
  title, value, description, icon: Icon, color, trend, actionLabel, onAction
}) => {
  return (
    <Card className="border hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          {trend && (
            <span className={`text-xs font-medium flex items-center gap-0.5 ${trend.isPositive ? 'text-emerald-600' : 'text-destructive'}`}>
              {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{title}</p>
        {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline" size="sm" className="w-full mt-3 text-xs h-7">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileAdminCard;
