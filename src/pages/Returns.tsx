
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RotateCcw, Clock, Shield, CheckCircle } from 'lucide-react';

const Returns = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <RotateCcw className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-xl text-gray-600">
            We want you to be completely satisfied with your purchase
          </p>
        </div>

        {/* Policy Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">14-Day Returns</h3>
              <p className="text-gray-600 text-sm">Return items within 14 days of delivery</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Original Condition</h3>
              <p className="text-gray-600 text-sm">Items must be unused and in original packaging</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Easy Process</h3>
              <p className="text-gray-600 text-sm">Simple online return request system</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">What can be returned?</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Smartphones and mobile accessories</li>
                <li>• Laptops and computer equipment</li>
                <li>• Audio equipment and headphones</li>
                <li>• Home appliances (unopened)</li>
                <li>• Gaming accessories</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Items that cannot be returned:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Personalized or customized items</li>
                <li>• Software with broken seals</li>
                <li>• Items damaged by misuse</li>
                <li>• Hygiene-sensitive products (earphones used)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return an Item</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-2">Contact Customer Service</h3>
                <p className="text-gray-600">Email us at returns@gadgetgenie.org or call +263719337910 with your order number and reason for return.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-2">Get Return Authorization</h3>
                <p className="text-gray-600">We'll provide you with a return authorization number and return instructions.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-2">Package and Ship</h3>
                <p className="text-gray-600">Pack the item securely in its original packaging and ship it to our returns center.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold mb-2">Receive Refund</h3>
                <p className="text-gray-600">Once we receive and inspect your return, we'll process your refund within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Processing Time</h3>
              <p className="text-gray-600">Refunds are processed within 5-7 business days after we receive your returned item.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Refund Method</h3>
              <p className="text-gray-600">Refunds will be issued to your original payment method. Credit card refunds may take 1-2 additional business days to appear on your statement.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Return Shipping</h3>
              <p className="text-gray-600">Return shipping costs are the responsibility of the customer unless the item was defective or we made an error.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Returns;
