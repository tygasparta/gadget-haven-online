
import React from 'react';
import { Calendar, ArrowRight, Zap, Smartphone, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TechNews = () => {
  const newsItems = [
    {
      id: 1,
      title: "iPhone 16 Series: Revolutionary AI Features Announced",
      excerpt: "Apple unveils groundbreaking AI capabilities in the latest iPhone lineup, including enhanced photography and productivity tools.",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=250&fit=crop",
      category: "Smartphones",
      date: "2 days ago",
      icon: Smartphone,
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "Gaming Laptops: RTX 5000 Series Performance Review",
      excerpt: "Comprehensive performance analysis of the latest RTX 5000 series graphics cards in gaming laptops.",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=250&fit=crop",
      category: "Gaming",
      date: "4 days ago",
      icon: Laptop,
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "Wireless Audio: The Future of Sound Technology",
      excerpt: "Exploring the latest advancements in wireless audio technology and what to expect in 2024.",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=250&fit=crop",
      category: "Audio",
      date: "1 week ago",
      icon: Zap,
      readTime: "4 min read"
    }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tech News & Reviews</h2>
          <p className="text-gray-600">Stay updated with the latest in technology</p>
        </div>
        <Button variant="outline" className="hidden sm:flex">
          View All Articles
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <article key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop";
                }}
              />
              <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <item.icon className="w-3 h-3" />
                {item.category}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
                <span>•</span>
                <span>{item.readTime}</span>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {item.excerpt}
              </p>
              
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Read More
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TechNews;
