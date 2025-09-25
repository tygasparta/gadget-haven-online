
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Package, Wallet } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import DischubPaymentSection from './DischubPaymentSection';
import PesePaymentSection from './PesePaymentSection';

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
  totalAmount: number;
  onInitiateDischubPayment: (currency: 'USD') => void;
  isDischubProcessing: boolean;
  // PesePay props
  pesePayCurrency: 'USD' | 'ZWL';
  setPesePayCurrency: (currency: 'USD' | 'ZWL') => void;
  onInitiatePesePayPayment: (currency: 'USD' | 'ZWL') => void;
  isPesePayProcessing: boolean;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  dischubCurrency,
  setDischubCurrency,
  totalAmount,
  onInitiateDischubPayment,
  isDischubProcessing,
  pesePayCurrency,
  setPesePayCurrency,
  onInitiatePesePayPayment,
  isPesePayProcessing
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

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all cursor-pointer">
              <RadioGroupItem value="pesepay" id="pesepay" className="text-green-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <label htmlFor="pesepay" className="font-semibold text-gray-800 cursor-pointer">
                    PesePay
                  </label>
                  <p className="text-sm text-gray-500">Mobile Money & Bank Cards (USD/ZWL)</p>
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

          <PesePaymentSection
            isVisible={paymentMethod === 'pesepay'}
            selectedCurrency={pesePayCurrency}
            onCurrencyChange={setPesePayCurrency}
            amount={totalAmount}
            onInitiatePayment={onInitiatePesePayPayment}
            isProcessing={isPesePayProcessing}
          />

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
