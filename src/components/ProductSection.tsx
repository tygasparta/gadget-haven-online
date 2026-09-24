
import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Sparkles, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SectionVariant = 'default' | 'deal' | 'new' | 'trending';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  showViewAll?: boolean;
  variant?: SectionVariant;
  viewAllPath?: string;
}

const VARIANT_CONFIG: Record<SectionVariant, { icon: React.ElementType; gradient: string; border: string; text: string; hoverBg: string }> = {
  default: { icon: Star, gradient: 'from-primary to-primary/80', border: 'border-primary', text: 'text-primary', hoverBg: 'hover:bg-primary/5' },
  deal: { icon: Zap, gradient: 'from-destructive to-destructive/80', border: 'border-destructive', text: 'text-destructive', hoverBg: 'hover:bg-destructive/5' },
  new: { icon: Sparkles, gradient: 'from-primary to-primary/80', border: 'border-primary', text: 'text-primary', hoverBg: 'hover:bg-primary/5' },
  trending: { icon: TrendingUp, gradient: 'from-warning to-warning/80', border: 'border-warning', text: 'text-warning', hoverBg: 'hover:bg-warning/5' },
};

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  showViewAll = true,
  variant = 'default',
  viewAllPath,
}) => {
  const navigate = useNavigate();
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  const handleViewAllClick = () => {
    navigate(viewAllPath ?? '/products');
  };

  return (
    <div className="mb-8 sm:mb-16 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-2 sm:mb-3">
            <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${config.gradient} text-white mr-2 sm:mr-4 flex-shrink-0`}>
              <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-3xl font-bold text-foreground flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="truncate">{title}</span>
                {variant === 'deal' && (
                  <span className="bg-gradient-to-r from-destructive to-destructive/80 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold animate-pulse shadow-md whitespace-nowrap">
                    ⚡ LIMITED TIME
                  </span>
                )}
              </h2>
            </div>
          </div>
          {subtitle && (
            <p className="text-sm sm:text-lg text-muted-foreground ml-8 sm:ml-14 line-clamp-2">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <Button
            variant="outline"
            className={`${config.border} ${config.text} ${config.hoverBg} px-3 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 flex items-center hover:scale-105 shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap flex-shrink-0`}
            onClick={handleViewAllClick}
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
