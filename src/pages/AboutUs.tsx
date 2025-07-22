
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, Globe, Zap, Heart, Shield } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '50K+', color: 'from-blue-500 to-blue-600' },
    { icon: Globe, label: 'Countries Served', value: '25+', color: 'from-green-500 to-green-600' },
    { icon: Zap, label: 'Products Sold', value: '100K+', color: 'from-orange-500 to-orange-600' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make is driven by what\'s best for our customers.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'We guarantee the authenticity and quality of every product we sell.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We stay ahead of tech trends to bring you the latest innovations.',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GadgetGenie
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted destination for cutting-edge technology and innovative gadgets. 
            We make tech accessible, affordable, and exciting for everyone.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2020, GadgetGenie started with a simple mission: to make the latest technology 
                accessible to everyone. What began as a small startup has grown into a trusted platform 
                serving thousands of tech enthusiasts worldwide.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe that technology should enhance lives, not complicate them. That's why we 
                carefully curate our product selection, ensuring every item meets our high standards 
                for quality, innovation, and value.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, GadgetGenie continues to evolve, always staying ahead of the curve to bring 
                you the most exciting tech innovations before they become mainstream.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop" 
                alt="Modern smartphones and tech gadgets"
                className="rounded-2xl shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
