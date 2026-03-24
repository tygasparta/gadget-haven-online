import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  totalAmount: number;
  // PesePay props
  onInitiatePesePayPayment: () => void;
  isPesePayProcessing: boolean;
  // PayPal props
  onInitiatePayPalPayment: () => void;
  isPayPalProcessing: boolean;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  totalAmount,
  onInitiatePesePayPayment,
  isPesePayProcessing,
  onInitiatePayPalPayment,
  isPayPalProcessing,
}) => {
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
            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all cursor-pointer">
              <RadioGroupItem value="pesepay" id="pesepay" className="text-green-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <label htmlFor="pesepay" className="font-semibold text-gray-800 cursor-pointer">
                    PesePay
                  </label>
                  <p className="text-sm text-gray-500">Pay with EcoCash, Visa, Mastercard & more</p>
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
          </RadioGroup>

          {paymentMethod === 'pesepay' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 border-l-4 border-green-200 bg-green-50/50 p-4 rounded-r-xl space-y-3"
            >
              <p className="text-sm text-green-700 font-medium">
                💳 You will be redirected to PesePay to complete your payment securely using EcoCash, Visa, Mastercard, or other supported methods.
              </p>
              <Button
                onClick={onInitiatePesePayPayment}
                disabled={isPesePayProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isPesePayProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)} with PesePay`}
              </Button>
            </motion.div>
          )}

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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentMethodSection;
