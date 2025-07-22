
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';
import PaymentTest from '@/components/PaymentTest';
import { useIsMobile } from '@/hooks/use-mobile';

const PaymentTestPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <div className={`max-w-4xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-lg border-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Payment Testing
              </h1>
              <p className="text-gray-500 mt-1">Test Paynow integration with web and mobile payments</p>
            </div>
          </div>
        </div>

        {/* Payment Test Component */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Paynow Integration Test</h2>
            <p className="text-gray-600">
              Use this interface to test both web and mobile payment methods. 
              The integration uses your configured Paynow credentials securely.
            </p>
          </div>
          
          <PaymentTest />
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Testing Instructions:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Web Payment:</strong> Redirects to Paynow gateway for card payments</li>
              <li>• <strong>Mobile Payment:</strong> Sends payment request to EcoCash/OneMoney</li>
              <li>• <strong>EcoCash:</strong> Use Econet numbers (077/078)</li>
              <li>• <strong>OneMoney:</strong> Use NetOne numbers (071/073)</li>
              <li>• Test amounts should be reasonable (e.g., $1.00 - $100.00)</li>
            </ul>
          </div>
        </div>
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default PaymentTestPage;
