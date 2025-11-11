import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Package, Wallet, Smartphone } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import DischubPaymentSection from './DischubPaymentSection';
import EcoCashPaymentSection from './EcoCashPaymentSection';

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  mobileMethod: string;
  setMobileMethod: (method: string) => void;
  phoneNumber: string;
  setPhoneNumber: (number: string) => void;
  // Dischub props
  dischubCurrency: 'USD';
  setDischubCurrency: (currency: 'USD') => void;
  // EcoCash props
  ecocashCurrency: 'USD' | 'ZWL';
  setEcocashCurrency: (currency: 'USD' | 'ZWL') => void;
  totalAmount: number;
  onInitiateDischubPayment: (currency: 'USD') => void;
  isDischubProcessing: boolean;
  // PayPal props
  onInitiatePayPalPayment: () => void;
  isPayPalProcessing: boolean;
  // EcoCash payment
  onInitiateEcocashPayment: () => void;
  isEcocashProcessing: boolean;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  dischubCurrency,
  setDischubCurrency,
  ecocashCurrency,
  setEcocashCurrency,
  totalAmount,
  onInitiateDischubPayment,
  isDischubProcessing,
  onInitiatePayPalPayment,
  isPayPalProcessing,
  onInitiateEcocashPayment,
  isEcocashProcessing
}) => {
  console.log('PaymentMethodSection rendering with method:', paymentMethod);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-gray-800">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
              <RadioGroupItem value="dischub" id="dischub" className="text-blue-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <label htmlFor="dischub" className="font-semibold text-gray-800 cursor-pointer">
                    Dischub Payment
                  </label>
                  <p className="text-sm text-gray-500">Pay with Dischub - USD only</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
              <RadioGroupItem value="paypal" id="paypal" className="text-blue-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <label htmlFor="paypal" className="font-semibold text-gray-800 cursor-pointer">
                    PayPal
                  </label>
                  <p className="text-sm text-gray-500">Pay securely with PayPal (USD)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all cursor-pointer">
              <RadioGroupItem value="ecocash" id="ecocash" className="text-green-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <label htmlFor="ecocash" className="font-semibold text-gray-800 cursor-pointer">
                    EcoCash
                  </label>
                  <p className="text-sm text-gray-500">Pay with EcoCash Mobile Money</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer">
              <RadioGroupItem value="cod" id="cod" className="text-orange-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <label htmlFor="cod" className="font-semibold text-gray-800 cursor-pointer">
                    Cash on Delivery
                  </label>
                  <p className="text-sm text-gray-500">Pay when your order arrives</p>
                </div>
              </div>
            </div>
          </RadioGroup>

          <DischubPaymentSection
            isVisible={paymentMethod === 'dischub'}
            selectedCurrency={dischubCurrency}
            onCurrencyChange={setDischubCurrency}
            amount={totalAmount}
            onInitiatePayment={onInitiateDischubPayment}
            isProcessing={isDischubProcessing}
          />

          {paymentMethod === 'paypal' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 border-l-4 border-blue-200 bg-blue-50/50 p-4 rounded-r-xl space-y-3"
            >
              <p className="text-sm text-blue-700 font-medium">
                💳 You will be redirected to PayPal to complete your payment securely.
              </p>
              <Button 
                onClick={onInitiatePayPalPayment}
                disabled={isPayPalProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isPayPalProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)} with PayPal`}
              </Button>
            </motion.div>
          )}

          {paymentMethod === 'ecocash' && (
            <EcoCashPaymentSection
              totalPrice={totalAmount}
              currency={ecocashCurrency}
              onCurrencyChange={setEcocashCurrency}
              onInitiatePayment={onInitiateEcocashPayment}
              isProcessing={isEcocashProcessing}
            />
          )}

          {paymentMethod === 'cod' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 border-l-4 border-orange-200 bg-orange-50/50 p-4 rounded-r-xl"
            >
              <p className="text-sm text-orange-700 font-medium">
                💰 Pay with cash when your order is delivered to your doorstep.
              </p>
              <p className="text-xs text-orange-600 mt-1">
                No additional fees • Secure delivery
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentMethodSection;
