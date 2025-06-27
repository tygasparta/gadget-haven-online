
import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {title === "Flash Sale ⚡" && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-3 animate-pulse">
                ⚡ FLASH
              </span>
            )}
          </div>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Button 
            variant="outline" 
            className={`border-${sectionColor}-500 text-${sectionColor}-600 hover:bg-${sectionColor}-50`}
          >
            View All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
