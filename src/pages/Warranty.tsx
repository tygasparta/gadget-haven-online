
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Clock, Phone, FileText } from 'lucide-react';

const Warranty = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Warranty Information</h1>
          <p className="text-xl text-gray-600">
            Your purchase is protected with comprehensive warranty coverage
          </p>
        </div>

        {/* Warranty Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Warranty Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">What's Covered</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Manufacturing defects</li>
                <li>• Hardware malfunctions</li>
                <li>• Component failures</li>
                <li>• Power-related issues</li>
                <li>• Display problems</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">What's Not Covered</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Physical damage from drops</li>
                <li>• Water damage</li>
                <li>• Damage from misuse</li>
                <li>• Software issues</li>
                <li>• Normal wear and tear</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warranty Periods */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Warranty Periods</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="font-semibold text-lg">Smartphones & Tablets</h3>
              <p className="text-gray-600">24 months manufacturer warranty</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="font-semibold text-lg">Laptops & Computers</h3>
              <p className="text-gray-600">12-24 months (varies by brand)</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="font-semibold text-lg">Audio Equipment</h3>
              <p className="text-gray-600">12 months manufacturer warranty</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="font-semibold text-lg">Home Appliances</h3>
              <p className="text-gray-600">12-36 months (varies by product)</p>
            </div>
          </div>
        </div>

        {/* Claim Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Claim Warranty</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-gray-600">Call us at +263719337910 or email warranty@gadgetgenie.org with your order number and issue description.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-2">Provide Documentation</h3>
                <p className="text-gray-600">Submit your purchase receipt, warranty card, and photos/videos of the issue if applicable.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-2">Assessment</h3>
                <p className="text-gray-600">Our technical team will assess your claim and determine the best course of action.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold mb-2">Resolution</h3>
                <p className="text-gray-600">We'll repair, replace, or refund your item based on the warranty terms and assessment results.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <Phone className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Warranty Support</h3>
            <p className="text-gray-600 mb-4">Get help with your warranty claim</p>
            <p className="font-semibold">+263719337910</p>
            <p className="text-sm text-gray-600">Mon-Fri: 9AM-5PM</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <FileText className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Keep these for warranty claims</p>
            <ul className="text-sm space-y-1">
              <li>• Original purchase receipt</li>
              <li>• Product warranty card</li>
              <li>• Product serial number</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Warranty;
