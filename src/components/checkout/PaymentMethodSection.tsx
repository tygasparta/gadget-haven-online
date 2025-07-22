
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Package, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  mobileMethod: string;
  setMobileMethod: (method: string) => void;
  phoneNumber: string;
  setPhoneNumber: (number: string) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  setPaymentMethod,
  mobileMethod,
  setMobileMethod,
  phoneNumber,
  setPhoneNumber
}) => {
  const getPlaceholder = () => {
    if (mobileMethod === 'ecocash') return '0771234567 or 0781234567';
    if (mobileMethod === 'onemoney') return '0711234567 or 0731234567';
    return '07XXXXXXXX';
  };

  const getRequiredPrefix = () => {
    if (mobileMethod === 'ecocash') return 'Econet (077/078)';
    if (mobileMethod === 'onemoney') return 'NetOne (071/073)';
    return 'Zimbabwe mobile';
  };

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
              <RadioGroupItem value="web" id="web" className="text-blue-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <label htmlFor="web" className="font-semibold text-gray-800 cursor-pointer">
                    Web Payment
                  </label>
                  <p className="text-sm text-gray-500">Secure payment with card or bank transfer</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all cursor-pointer">
              <RadioGroupItem value="mobile" id="mobile" className="text-green-600" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <label htmlFor="mobile" className="font-semibold text-gray-800 cursor-pointer">
                    Mobile Payment
                  </label>
                  <p className="text-sm text-gray-500">Pay with EcoCash or OneMoney</p>
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

          {paymentMethod === 'mobile' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pl-4 border-l-4 border-green-200 bg-green-50/50 p-4 rounded-r-xl"
            >
              <RadioGroup value={mobileMethod} onValueChange={setMobileMethod} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ecocash" id="ecocash" />
                  <label htmlFor="ecocash" className="font-medium">EcoCash (Econet - 077/078)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onemoney" id="onemoney" />
                  <label htmlFor="onemoney" className="font-medium">OneMoney (NetOne - 071/073)</label>
                </div>
              </RadioGroup>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Mobile Number * ({getRequiredPrefix()} required)
                </Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your Zimbabwe mobile number (10 digits starting with 07)
                </p>
              </div>
            </motion.div>
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
