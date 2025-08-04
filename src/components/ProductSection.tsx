
import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const getSectionIcon = () => {
    if (title.includes("Flash Sale")) return <Zap className="w-4 h-4 sm:w-6 sm:h-6" />;
    if (title.includes("New Arrivals")) return <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />;
    if (title.includes("Best Sellers")) return <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />;
    return null;
  };

  const getColorClasses = () => {
    switch (sectionColor) {
      case "red":
        return {
          border: "border-red-500",
          text: "text-red-600",
          bg: "hover:bg-red-50",
          gradient: "from-red-500 to-red-600"
        };
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

  const handleViewAllClick = () => {
    if (title.includes("Flash Sale")) {
      navigate('/deals');
    } else if (title.includes("New Arrivals")) {
      navigate('/products?filter=new-arrivals');
    } else if (title.includes("Best Sellers")) {
      navigate('/products?filter=best-sellers');
    } else {
      navigate('/products');
    }
  };

  const colors = getColorClasses();

  return (
    <div className="mb-12 sm:mb-16 lg:mb-20 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 lg:mb-12 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${colors.gradient} text-white mr-3 sm:mr-4 flex-shrink-0 shadow-lg`}>
              {getSectionIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3">
                <span className="truncate">{title}</span>
                {title === "Flash Sale ⚡" && (
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold animate-pulse shadow-lg whitespace-nowrap">
                    ⚡ LIMITED TIME
                  </span>
                )}
              </h2>
            </div>
          </div>
          {subtitle && (
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 ml-11 sm:ml-16 lg:ml-20 line-clamp-2">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <Button 
            variant="outline" 
            className={`${colors.border} ${colors.text} ${colors.bg} px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-semibold rounded-xl lg:rounded-2xl transition-all duration-200 flex items-center hover:scale-105 shadow-md hover:shadow-lg text-base sm:text-lg whitespace-nowrap flex-shrink-0`}
            onClick={handleViewAllClick}
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
