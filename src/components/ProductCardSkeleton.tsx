import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="aspect-square animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded animate-shimmer" />
        <div className="h-3 w-1/3 rounded animate-shimmer" />
        <div className="h-3 w-1/2 rounded animate-shimmer" />
        <div className="h-6 w-1/2 rounded animate-shimmer" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
