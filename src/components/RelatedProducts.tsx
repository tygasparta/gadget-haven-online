import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';

interface RelatedProductsProps {
  category: string | null;
  excludeId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, excludeId }) => {
  const { data: allProducts = [] } = useProducts();

  const related = allProducts
    .filter((p) => p.id !== excludeId && category && p.category?.toLowerCase() === category.toLowerCase())
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      rating: p.rating,
      reviews: p.reviews,
      image: p.image,
      brand: p.brand,
      stock: p.stock,
      discount: p.discount_percentage > 0 ? `${p.discount_percentage}% OFF` : undefined,
      isFlash: p.is_flash_sale,
    }));

  if (related.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Related Products</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
