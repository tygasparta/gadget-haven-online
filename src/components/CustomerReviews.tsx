
import React from 'react';
import { Star, Quote, ThumbsUp, Verified } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      product: "iPhone 15 Pro",
      rating: 5,
      text: "Amazing product quality! Fast shipping and excellent customer service.",
      date: "2 days ago",
      verified: true,
      likes: 12
    },
    {
      id: 2,
      name: "Mike Chen",
      product: "MacBook Air M2",
      rating: 5,
      text: "Best purchase I've made this year. Works perfectly for my needs!",
      date: "1 week ago",
      verified: true,
      likes: 8
    },
    {
      id: 3,
      name: "Emma Davis",
      product: "AirPods Pro",
      rating: 4,
      text: "Great sound quality and the noise cancellation is impressive.",
      date: "3 days ago",
      verified: true,
      likes: 15
    }
  ];

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
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
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center">
        <p className="text-sm font-medium text-gray-700">
          ⭐ 4.8/5 average rating from 2,547+ reviews
        </p>
      </div>
    </div>
  );
};

export default CustomerReviews;
