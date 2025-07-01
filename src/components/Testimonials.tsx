
import React from 'react';
import { Star, Quote, User } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Tech Enthusiast",
      rating: 5,
      comment: "Amazing selection of products and incredibly fast delivery! Got my MacBook in just 2 days. The customer service is top-notch.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1e5?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Developer",
      rating: 5,
      comment: "Best prices I've found anywhere! Saved over $200 on my gaming setup. The warranty service is excellent too.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Content Creator",
      rating: 5,
      comment: "The product quality is outstanding. Everything arrived exactly as described. Will definitely shop here again!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Park",
      role: "Business Owner",
      rating: 4,
      comment: "Great experience overall. The VIP program perks are really worth it. Fast shipping and excellent customer support.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="w-full mb-8 bg-gray-50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Quote className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-800">What Our Customers Say</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us for their tech needs
        </p>
      </div>

      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.comment}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`;
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">50K+</div>
          <div className="text-sm text-gray-600">Happy Customers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">99.8%</div>
          <div className="text-sm text-gray-600">Satisfaction Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <div className="text-sm text-gray-600">Customer Support</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">2M+</div>
          <div className="text-sm text-gray-600">Products Delivered</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
