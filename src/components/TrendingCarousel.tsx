
import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const trendingProducts = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro',
    price: 1200,
    originalPrice: 1299,
    rating: 4.5,
    discount: '+25%',
    image: '/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png'
  },
  {
    id: 2,
    name: 'Samsung Galaxy A55 5G',
    price: 449,
    originalPrice: 549,
    rating: 4.5,
    discount: '+20%',
    image: '/lovable-uploads/0d190627-ad58-4879-a433-67b3012a1faf.png'
  },
  {
    id: 3,
    name: 'JBL Charge 5 Speaker',
    price: 179,
    originalPrice: 199,
    rating: 4.5,
    discount: '+15%',
    image: '/lovable-uploads/0ddc703b-d046-4e1d-8c7d-8a5624da50a7.png'
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    price: 349,
    originalPrice: 399,
    rating: 4.8,
    discount: '+18%',
    image: '/lovable-uploads/0ddc703b-d046-4e1d-8c7d-8a5624da50a7.png'
  }
];

const TrendingCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between gap-4 mb-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Trending Now</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Most searched this week</p>
        </div>
        <button
          className="flex items-center text-sm font-medium text-primary hover:underline whitespace-nowrap"
          onClick={() => navigate('/products?trending=true')}
        >
          View all
          <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {trendingProducts.map((product, index) => (
          <button
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="relative text-left bg-card border border-border rounded-lg p-3 sm:p-4 hover:shadow-md transition-all group"
          >
            <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold text-muted-foreground bg-background/90 px-1.5 py-0.5 rounded-[3px] z-10 tabular-nums">
              #{index + 1}
            </span>
            <div className="aspect-square bg-muted/40 rounded-lg overflow-hidden mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop'; }}
              />
            </div>
            <h3 className="font-medium text-sm text-foreground truncate">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-rating fill-current" />
              <span className="text-xs text-muted-foreground">{product.rating}</span>
              
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-bold text-foreground">${product.price}</span>
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;
