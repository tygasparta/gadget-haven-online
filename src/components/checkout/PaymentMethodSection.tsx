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
      <Card className="shadow-lg border-0 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-foreground">
            <div className="p-2 bg-accent rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-success/20 hover:bg-success/10/30 transition-all cursor-pointer">
              <RadioGroupItem value="pesepay" id="pesepay" className="text-success" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Wallet className="w-4 h-4 text-success" />
                </div>
                <div>
                  <label htmlFor="pesepay" className="font-semibold text-foreground cursor-pointer">
                    PesePay
                  </label>
                  <p className="text-sm text-muted-foreground">Pay with EcoCash, Visa, Mastercard & more</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/20 hover:bg-primary/10/30 transition-all cursor-pointer">
              <RadioGroupItem value="paypal" id="paypal" className="text-primary" />
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <label htmlFor="paypal" className="font-semibold text-foreground cursor-pointer">
                    PayPal
                  </label>
                  <p className="text-sm text-muted-foreground">Pay securely with PayPal (USD)</p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {paymentMethod === 'pesepay' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 border-l-4 border-success/20 bg-success/10/50 p-4 rounded-r-xl space-y-3"
            >
              <p className="text-sm text-success font-medium">
                💳 You will be redirected to PesePay to complete your payment securely using EcoCash, Visa, Mastercard, or other supported methods.
              </p>
              <Button
                onClick={onInitiatePesePayPayment}
                disabled={isPesePayProcessing}
                className="w-full bg-success hover:bg-success/90"
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
              className="pl-4 border-l-4 border-primary/20 bg-primary/10/50 p-4 rounded-r-xl space-y-3"
            >
              <p className="text-sm text-primary font-medium">
                💳 You will be redirected to PayPal to complete your payment securely.
              </p>
              <Button
                onClick={onInitiatePayPalPayment}
                disabled={isPayPalProcessing}
                className="w-full bg-primary hover:bg-primary/90"
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
