
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, MapPin, Clock, DollarSign } from 'lucide-react';

const ShippingInfo = () => {
  const shippingZones = [
    { city: 'Harare', time: '1-2 days', cost: '$5' },
    { city: 'Bulawayo', time: '2-3 days', cost: '$8' },
    { city: 'Mutare', time: '2-4 days', cost: '$10' },
    { city: 'Gweru', time: '3-5 days', cost: '$10' },
    { city: 'Other Cities', time: '3-7 days', cost: '$12' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Truck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600">
            Fast, reliable delivery across Zimbabwe
          </p>
        </div>

        {/* Shipping Options */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Standard Shipping</h3>
              <p className="text-gray-600 mb-4">Our most popular shipping option with tracking included.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span>2-7 business days</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span>$5-$12 (varies by location)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                  <span>Nationwide coverage</span>
                </div>
              </div>
            </div>

            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">Express Shipping</h3>
              <p className="text-blue-800 mb-4">Faster delivery for urgent orders.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-900">1-3 business days</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-blue-900">$15-$25 (varies by location)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-blue-900">Major cities only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Zones & Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Destination</th>
                  <th className="text-left py-3 px-4">Delivery Time</th>
                  <th className="text-left py-3 px-4">Shipping Cost</th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map((zone, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{zone.city}</td>
                    <td className="py-3 px-4">{zone.time}</td>
                    <td className="py-3 px-4">{zone.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            * Free shipping on orders over $100 to major cities
          </p>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Processing</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Orders placed before 2 PM are processed the same day</li>
              <li>• Orders placed after 2 PM are processed the next business day</li>
              <li>• Weekend orders are processed on Monday</li>
              <li>• You'll receive tracking information once your order ships</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Signature required for orders over $200</li>
              <li>• We deliver Monday to Saturday, 9 AM to 6 PM</li>
              <li>• Alternative delivery arrangements available</li>
              <li>• Contact us if you won't be available for delivery</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingInfo;
