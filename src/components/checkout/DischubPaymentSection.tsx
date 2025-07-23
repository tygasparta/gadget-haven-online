
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Wallet, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import DischubService from '@/services/dischubService';

interface DischubPaymentSectionProps {
  isVisible: boolean;
  selectedCurrency: 'USD' | 'ZWG';
  onCurrencyChange: (currency: 'USD' | 'ZWG') => void;
  amount: number;
  onInitiatePayment: (currency: 'USD' | 'ZWG') => void;
  isProcessing: boolean;
}

const DischubPaymentSection: React.FC<DischubPaymentSectionProps> = ({
  isVisible,
  selectedCurrency,
  onCurrencyChange,
  amount,
  onInitiatePayment,
  isProcessing
}) => {
  const dischubService = new DischubService();
  const currencies = dischubService.getSupportedCurrencies();
  
  const validation = dischubService.validatePayment(amount, selectedCurrency);
  
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 pl-4 border-l-4 border-blue-200 bg-blue-50/50 p-4 rounded-r-xl"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Wallet className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Dischub Payment</h3>
          <p className="text-sm text-gray-600">Pay with Dischub - Zimbabwe's trusted payment platform</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
            Select Currency *
          </Label>
          <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{currency.symbol}</span>
                    <span>{currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Amount to Pay:</span>
            <span className="font-semibold text-lg">
              {dischubService.formatCurrency(amount, selectedCurrency)}
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            Maximum limits: USD $480.00 • ZWG 7,000.00
          </div>
        </div>

        {!validation.valid && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{validation.error}</p>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-1">
            💡 How Dischub Payment Works:
          </p>
          <ol className="text-xs text-blue-600 space-y-1">
            <li>1. Click "Pay with Dischub" below</li>
            <li>2. You'll be redirected to Dischub's secure payment page</li>
            <li>3. Log in with your Dischub account credentials</li>
            <li>4. Complete the payment and return to our site</li>
          </ol>
        </div>

        <Button 
          onClick={() => onInitiatePayment(selectedCurrency)}
          disabled={isProcessing || !validation.valid}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isProcessing ? 'Processing...' : `Pay ${dischubService.formatCurrency(amount, selectedCurrency)} with Dischub`}
        </Button>
      </div>
    </motion.div>
  );
};

export default DischubPaymentSection;
