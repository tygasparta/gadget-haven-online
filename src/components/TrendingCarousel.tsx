
import React from 'react';
import { Star, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    <div className="mb-8 sm:mb-16">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-warning to-warning/80 text-warning-foreground">
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-foreground">Trending Now</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Most searched this week</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-warning text-warning hover:bg-warning/5 px-3 sm:px-6 py-2 font-semibold rounded-lg text-sm whitespace-nowrap flex-shrink-0"
          onClick={() => navigate('/products?trending=true')}
        >
          <span className="hidden sm:inline">View All</span>
          <span className="sm:hidden">All</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {trendingProducts.map((product, index) => (
          <button
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="relative text-left bg-card border border-border rounded-xl p-3 sm:p-4 hover:border-warning/40 hover:shadow-md transition-all group"
          >
            <span className="absolute top-2.5 left-2.5 w-6 h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-xs font-bold z-10">
              {index + 1}
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
              <span className="text-xs text-success font-medium ml-1">{product.discount} searches</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-bold text-primary">${product.price}</span>
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;
