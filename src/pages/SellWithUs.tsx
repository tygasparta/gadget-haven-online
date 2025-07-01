
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Store, TrendingUp, Shield, Users, CheckCircle, Mail } from 'lucide-react';

const SellWithUs = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Reach thousands of customers across Zimbabwe through our platform."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Get paid securely and on time with our reliable payment system."
    },
    {
      icon: Users,
      title: "Marketing Support",
      description: "Benefit from our marketing campaigns and promotional activities."
    },
    {
      icon: Store,
      title: "Easy Management",
      description: "Manage your inventory and orders through our seller dashboard."
    }
  ];

  const requirements = [
    "Valid business registration in Zimbabwe",
    "Quality products with proper documentation",
    "Ability to fulfill orders within specified timeframes",
    "Commitment to excellent customer service",
    "Competitive pricing and authentic products"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Sell With Gadget Genie</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Zimbabwe's largest online marketplace for electronics and technology. 
            Expand your business reach and grow your sales with our trusted platform.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Sell With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply</h3>
              <p className="text-gray-600">Submit your application with business details and product information.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Approved</h3>
              <p className="text-gray-600">Our team reviews your application and approves qualified sellers.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Selling</h3>
              <p className="text-gray-600">List your products and start reaching customers nationwide.</p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories We Accept</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Smartphones & Mobile Devices",
                "Laptops & Computers",
                "Audio & Headphones",
                "Smart Home Devices",
                "Gaming Accessories",
                "Camera & Photography",
                "Wearable Technology",
                "Home Appliances"
              ].map((category, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join hundreds of successful sellers on our platform
          </p>
          <a 
            href="mailto:sellers@gadgetgenie.org" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block font-semibold"
          >
            Apply to Become a Seller
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellWithUs;
