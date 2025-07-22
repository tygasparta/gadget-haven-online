
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentTest from '@/components/PaymentTest';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from '@/components/MobileNavigation';

const PaymentTestPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <Header /> : <Header />}
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Testing</h1>
          <p className="text-gray-600">Test the payment functionality with different payment methods</p>
        </div>
        
        <PaymentTest />
      </main>
      
      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default PaymentTestPage;
