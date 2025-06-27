
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
    if (title.includes("Flash Sale")) return <Zap className="w-6 h-6" />;
    if (title.includes("New Arrivals")) return <Sparkles className="w-6 h-6" />;
    if (title.includes("Best Sellers")) return <TrendingUp className="w-6 h-6" />;
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
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colors.gradient} text-white mr-4`}>
              {getSectionIcon()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                {title}
                {title === "Flash Sale ⚡" && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold ml-4 animate-pulse shadow-lg">
                    ⚡ LIMITED TIME
                  </span>
                )}
              </h2>
            </div>
          </div>
          {subtitle && (
            <p className="text-gray-600 text-lg ml-14">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <Button 
            variant="outline" 
            className={`${colors.border} ${colors.text} ${colors.bg} px-6 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center hover:scale-105 shadow-md hover:shadow-lg`}
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
