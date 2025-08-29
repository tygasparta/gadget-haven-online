import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface MobileAdminCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  actionLabel?: string;
  onAction?: () => void;
}

const MobileAdminCard: React.FC<MobileAdminCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
  actionLabel,
  onAction
}) => {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"} 
              className={`${trend.isPositive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <CardTitle className="text-white text-sm font-medium">{title}</CardTitle>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {description && (
            <p className="text-gray-400 text-xs mt-1">{description}</p>
          )}
        </div>
        
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            size="sm"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileAdminCard;