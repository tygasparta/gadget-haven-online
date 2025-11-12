import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EcoCashPaymentSectionProps {
  totalPrice: number;
  onInitiatePayment: () => void;
  isProcessing: boolean;
}

const EcoCashPaymentSection: React.FC<EcoCashPaymentSectionProps> = ({
  totalPrice,
  onInitiatePayment,
  isProcessing,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 mt-4"
    >
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">EcoCash Payment</h4>
        <p className="text-sm text-muted-foreground mb-4">
          You will be redirected to EcoCash to complete your payment securely.
        </p>

        <div className="space-y-3">
          <div className="pt-3">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalPrice)}
              </span>
            </div>

            <Button
              type="button"
              onClick={onInitiatePayment}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay with EcoCash'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>• Secure payment processing through EcoCash</p>
        <p>• Your payment information is protected</p>
        <p>• You will receive a confirmation after payment</p>
      </div>
    </motion.div>
  );
};

export default EcoCashPaymentSection;
