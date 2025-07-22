
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CreditCard, Shield, Smartphone, Building, Lock, CheckCircle } from 'lucide-react';

const PaymentMethods = () => {
  const paymentMethods = [
    {
      icon: CreditCard,
      name: 'Credit & Debit Cards',
      description: 'Visa, Mastercard, American Express, Discover',
      features: ['Instant processing', '3D Secure protection', 'Refunds in 3-5 days'],
      accepted: true
    },
    {
      icon: Smartphone,
      name: 'Mobile Money',
      description: 'EcoCash, OneMoney, Telecash',
      features: ['Local payment method', 'Instant confirmation', 'No additional fees'],
      accepted: true
    },
    {
      icon: Building,
      name: 'Bank Transfer',
      description: 'Direct bank transfers and wire payments',
      features: ['Secure bank-to-bank', 'Lower fees', '1-3 business days'],
      accepted: true
    },
    {
      icon: CreditCard,
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      features: ['Buyer protection', 'Quick checkout', 'No card details needed'],
      accepted: true
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'SSL Encryption',
      description: '256-bit SSL encryption protects all transactions'
    },
    {
      icon: Lock,
      title: 'PCI Compliance',
      description: 'We meet the highest security standards for card processing'
    },
    {
      icon: CheckCircle,
      title: 'Fraud Protection',
      description: 'Advanced fraud detection monitors every transaction'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Methods</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer multiple secure payment options to make your shopping experience convenient and safe.
          </p>
        </div>
        
        {/* Payment Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Accepted Payment Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                      {method.accepted && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">{method.description}</p>
                    <ul className="space-y-1">
                      {method.features.map((feature, fIndex) => (
                        <li key={fIndex} className="text-sm text-gray-500 flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Payment Security</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How Payment Works</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Add to Cart', desc: 'Select your items and add them to cart' },
                { step: '2', title: 'Checkout', desc: 'Review your order and shipping details' },
                { step: '3', title: 'Payment', desc: 'Choose your preferred payment method' },
                { step: '4', title: 'Confirmation', desc: 'Receive order confirmation and tracking' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Processing</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Payments are processed immediately upon order confirmation</li>
                <li>• You will receive an email confirmation with payment details</li>
                <li>• Billing address must match your payment method</li>
                <li>• Currency conversion handled automatically</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refunds & Disputes</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Refunds processed within 5-7 business days</li>
                <li>• Original payment method will be credited</li>
                <li>• Dispute resolution available through payment providers</li>
                <li>• Contact support for payment-related issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentMethods;
