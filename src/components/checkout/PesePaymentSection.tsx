import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import PesePayService from '@/services/pesePayService';

interface PesePaymentSectionProps {
  isVisible: boolean;
  selectedCurrency: 'USD' | 'ZWL';
  onCurrencyChange: (currency: 'USD' | 'ZWL') => void;
  amount: number;
  onInitiatePayment: (currency: 'USD' | 'ZWL') => void;
  isProcessing: boolean;
}

const PesePaymentSection: React.FC<PesePaymentSectionProps> = ({
  isVisible,
  selectedCurrency,
  onCurrencyChange,
  amount,
  onInitiatePayment,
  isProcessing
}) => {
  const pesePayService = new PesePayService();
  const validation = pesePayService.validatePayment(amount, selectedCurrency);
  const currencies = pesePayService.getSupportedCurrencies();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 border border-border rounded-lg bg-card"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-foreground">PesePay Payment Details</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Currency
            </label>
            <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount to pay:</span>
              <span className="font-medium text-foreground">
                {pesePayService.formatCurrency(amount, selectedCurrency)}
              </span>
            </div>
          </div>

          {!validation.valid && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{validation.error}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• You will be redirected to PesePay's secure payment gateway</p>
            <p>• Supports mobile money, bank cards, and other payment methods</p>
            <p>• Transaction is secured with encryption</p>
          </div>
        </div>

        <Button 
          onClick={() => onInitiatePayment(selectedCurrency)}
          disabled={isProcessing || !validation.valid}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pay with PesePay
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default PesePaymentSection;