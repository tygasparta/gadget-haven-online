
import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Sparkles, TrendingUp } from 'lucide-react';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  showViewAll?: boolean;
  sectionColor?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  subtitle, 
  products, 
  showViewAll = true,
  sectionColor = "blue"
}) => {
  const getSectionIcon = () => {
    if (title.includes("Flash Sale")) return <Zap className="w-4 h-4 sm:w-6 sm:h-6" />;
    if (title.includes("New Arrivals")) return <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />;
    if (title.includes("Best Sellers")) return <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />;
    return null;
  };

  const getColorClasses = () => {
    switch (sectionColor) {
      case "blue":
        return {
          border: "border-blue-500",
          text: "text-blue-600",
          bg: "hover:bg-blue-50",
          gradient: "from-blue-500 to-blue-600"
        };
      case "green":
        return {
          border: "border-green-500",
          text: "text-green-600",
          bg: "hover:bg-green-50",
          gradient: "from-green-500 to-green-600"
        };
      default:
        return {
          border: "border-blue-500",
          text: "text-blue-600",
          bg: "hover:bg-blue-50",
          gradient: "from-blue-500 to-blue-600"
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="mb-8 sm:mb-16 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-2 sm:mb-3">
            <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${colors.gradient} text-white mr-2 sm:mr-4 flex-shrink-0`}>
              {getSectionIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-3xl font-bold text-gray-800 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="truncate">{title}</span>
                {title === "Flash Sale ⚡" && (
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold animate-pulse shadow-lg whitespace-nowrap">
                    ⚡ LIMITED TIME
                  </span>
                )}
              </h2>
            </div>
          </div>
          {subtitle && (
            <p className="text-sm sm:text-lg text-gray-600 ml-8 sm:ml-14 line-clamp-2">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <Button 
            variant="outline" 
            className={`${colors.border} ${colors.text} ${colors.bg} px-3 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 flex items-center hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap flex-shrink-0`}
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
