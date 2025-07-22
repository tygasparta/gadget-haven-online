
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, Clock, MapPin, Package, Globe, Shield } from 'lucide-react';

const ShippingInfo = () => {
  const shippingMethods = [
    {
      icon: Truck,
      name: 'Standard Shipping',
      time: '3-5 Business Days',
      cost: 'Free on orders over $50',
      description: 'Our most popular shipping option with reliable delivery timeframes.'
    },
    {
      icon: Clock,
      name: 'Express Shipping',
      time: '1-2 Business Days',
      cost: '$9.99',
      description: 'Fast delivery for when you need your gadgets quickly.'
    },
    {
      icon: Globe,
      name: 'International Shipping',
      time: '7-14 Business Days',
      cost: 'Varies by location',
      description: 'We ship to over 25 countries worldwide.'
    },
    {
      icon: Package,
      name: 'Premium Packaging',
      time: 'Same as selected method',
      cost: '$4.99',
      description: 'Extra protective packaging for fragile items.'
    }
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
    'Japan', 'South Korea', 'Singapore', 'New Zealand', 'Netherlands', 'Sweden',
    'Norway', 'Denmark', 'Switzerland', 'Austria', 'Belgium', 'Ireland',
    'South Africa', 'Zimbabwe', 'Botswana', 'Namibia', 'Kenya', 'Ghana', 'Nigeria'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Shipping Information</h1>
        
        {/* Shipping Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {shippingMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.name}</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-sm font-medium text-green-600">{method.time}</span>
                      <span className="text-sm font-medium text-blue-600">{method.cost}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shipping Policies</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Orders placed before 2 PM EST ship same day</li>
                <li>• Weekend orders ship on Monday</li>
                <li>• Holiday processing may be delayed</li>
                <li>• Custom orders may take 1-2 additional days</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Restrictions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Some items cannot be shipped internationally</li>
                <li>• Lithium battery products have shipping restrictions</li>
                <li>• Large items may require special handling</li>
                <li>• PO Box delivery available for most items</li>
              </ul>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">International Shipping</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">We Ship To</h3>
                <div className="grid grid-cols-2 gap-2">
                  {countries.slice(0, 12).map((country, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{country}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">And 15+ more countries...</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Customs duties and taxes are customer responsibility</li>
                  <li>• Delivery times may vary due to customs processing</li>
                  <li>• Some countries have import restrictions</li>
                  <li>• We declare accurate values for customs</li>
                  <li>• Tracking available for most international shipments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Packaging & Security */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-2xl font-bold mb-4">Secure Packaging</h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              All orders are carefully packaged with protective materials to ensure your gadgets arrive safely. 
              We use eco-friendly packaging materials whenever possible and include tracking information 
              for all shipments.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="font-semibold">Protective Packaging</div>
              </div>
              <div>
                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="font-semibold">Insurance Available</div>
              </div>
              <div>
                <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                <div className="font-semibold">Full Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingInfo;
