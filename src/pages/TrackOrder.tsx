
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Package, Search, CheckCircle, Clock, Truck } from 'lucide-react';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate tracking result
    setTrackingResult({
      orderNumber: orderNumber,
      status: 'In Transit',
      estimatedDelivery: '2025-01-05',
      timeline: [
        { status: 'Order Placed', date: '2025-01-01', completed: true },
        { status: 'Payment Confirmed', date: '2025-01-01', completed: true },
        { status: 'Processing', date: '2025-01-02', completed: true },
        { status: 'Shipped', date: '2025-01-03', completed: true },
        { status: 'In Transit', date: '2025-01-04', completed: true },
        { status: 'Out for Delivery', date: '2025-01-05', completed: false },
        { status: 'Delivered', date: '2025-01-05', completed: false }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600">
            Enter your order details below to track your shipment
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number *
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your order number (e.g., GG123456)"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the email used for your order"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Track Order
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{trackingResult.orderNumber}</h2>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {trackingResult.status}
                </span>
                <span className="text-gray-600">
                  Estimated delivery: {new Date(trackingResult.estimatedDelivery).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {trackingResult.timeline.map((step: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        {step.status === 'Out for Delivery' ? (
                          <Truck className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.status}
                      </h3>
                      <span className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you're having trouble tracking your order or have questions about delivery, our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center">
              Contact Support
            </a>
            <a href="/help-centre" className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center">
              Visit Help Centre
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
