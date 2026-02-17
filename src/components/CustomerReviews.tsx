
import React, { useState } from 'react';
import { Star, Quote, ThumbsUp, Verified } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';

const CustomerReviews = () => {
  const { data: products = [] } = useProducts();
  const [likedReviews, setLikedReviews] = useState<number[]>([]);

  // Create reviews based on actual products with Zimbabwean names
  const createReviewsFromProducts = () => {
    const zimbabweanNames = [
      "Tendai Mukamuri", "Chipo Madzima", "Tafadzwa Nyambi", "Rutendo Chikwanha", 
      "Blessing Mutasa", "Farai Zimunya", "Tinashe Dhliwayo", "Memory Gumbo",
      "Tatenda Mapfumo", "Privilege Mhango", "Takudzwa Sibanda", "Nyasha Moyo"
    ];
    
    const reviewTexts = [
      "Amazing product quality! Fast delivery to Harare and excellent customer service.",
      "Best purchase I've made this year. Works perfectly for my needs in Bulawayo!",
      "Great value for money and the performance exceeded my expectations. Highly recommend!",
      "Outstanding build quality! The delivery to Mutare was super quick.",
      "Perfect for what I needed. Customer service was very helpful and professional.",
      "Excellent product, exactly as described. Very satisfied with my purchase!"
    ];

    return products.slice(0, 3).map((product, index) => ({
      id: index + 1,
      name: zimbabweanNames[index],
      product: product.name,
      rating: Math.min(5, Math.max(4, Math.round(product.rating || 4.5))),
      text: reviewTexts[index % reviewTexts.length],
      date: `${index + 1} day${index > 0 ? 's' : ''} ago`,
      verified: true,
      likes: Math.floor(Math.random() * 20) + 5
    }));
  };

  const reviews = products.length > 0 ? createReviewsFromProducts() : [
    {
      id: 1,
      name: "Tendai Mukamuri",
      product: "iPhone 15 Pro",
      rating: 5,
      text: "Amazing product quality! Fast delivery to Harare and excellent customer service.",
      date: "2 days ago",
      verified: true,
      likes: 12
    },
    {
      id: 2,
      name: "Chipo Madzima",
      product: "MacBook Air M2",
      rating: 5,
      text: "Best purchase I've made this year. Works perfectly for my needs in Bulawayo!",
      date: "1 week ago",
      verified: true,
      likes: 8
    },
    {
      id: 3,
      name: "Tafadzwa Nyambi",
      product: "AirPods Pro",
      rating: 4,
      text: "Great sound quality and the noise cancellation is impressive. Delivery to Mutare was quick!",
      date: "3 days ago",
      verified: true,
      likes: 15
    }
  ];

  const handleLikeReview = (reviewId: number) => {
    setLikedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const calculateAverageRating = () => {
    if (products.length === 0) return 4.8;
    const totalRating = products.reduce((sum, product) => sum + (product.rating || 4.5), 0);
    return (totalRating / products.length).toFixed(1);
  };

  const getTotalReviews = () => {
    if (products.length === 0) return 2547;
    return products.reduce((sum, product) => sum + (product.reviews || 100), 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
          <Star className="w-5 h-5 text-white fill-current" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">Customer Reviews</h3>
          <p className="text-sm text-gray-600">What our customers say</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                  {review.verified && (
                    <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0 h-5">
                      <Verified className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">for {review.product}</span>
                </div>
                
                <div className="relative">
                  <Quote className="w-4 h-4 text-gray-300 absolute -top-1 -left-1" />
                  <p className="text-sm text-gray-700 pl-3 mb-2">{review.text}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{review.date}</span>
                  <button 
                    className={`flex items-center gap-1 hover:text-sky-600 transition-colors ${
                      likedReviews.includes(review.id) ? 'text-sky-600' : ''
                    }`}
                    onClick={() => handleLikeReview(review.id)}
                  >
                    <ThumbsUp className={`w-3 h-3 ${likedReviews.includes(review.id) ? 'fill-current' : ''}`} />
                    <span>{review.likes + (likedReviews.includes(review.id) ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl text-center">
        <p className="text-sm font-medium text-gray-700">
          ⭐ {calculateAverageRating()}/5 average rating from {getTotalReviews().toLocaleString()}+ reviews
        </p>
      </div>
    </div>
  );
};

export default CustomerReviews;
