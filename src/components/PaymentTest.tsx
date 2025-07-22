
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import usePaynow from '@/hooks/usePaynow';
import { useToast } from '@/hooks/use-toast';

const PaymentTest = () => {
  const [amount, setAmount] = useState('10.00');
  const [email, setEmail] = useState('test@example.com');
  const [phoneNumber, setPhoneNumber] = useState('0771234567');
  const [paymentMethod, setPaymentMethod] = useState('web');
  const [mobileMethod, setMobileMethod] = useState('ecocash');
  
  const { initiateWebPayment, initiateMobilePayment, isProcessing } = usePaynow();
  const { toast } = useToast();

  const handleTestPayment = async () => {
    const paymentData = {
      reference: `TEST-${Date.now()}`,
      amount: parseFloat(amount),
      email: email,
      additionalInfo: 'Test Payment'
    };

    try {
      if (paymentMethod === 'web') {
        await initiateWebPayment(paymentData);
      } else if (paymentMethod === 'mobile') {
        await initiateMobilePayment(paymentData, phoneNumber, mobileMethod as 'ecocash' | 'onemoney');
      }
    } catch (error) {
      toast({
        title: "Test Payment Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="web" id="web" />
              <Label htmlFor="web">Web Payment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mobile" id="mobile" />
              <Label htmlFor="mobile">Mobile Payment</Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'mobile' && (
          <>
            <div>
              <Label>Mobile Provider</Label>
              <RadioGroup value={mobileMethod} onValueChange={setMobileMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ecocash" id="ecocash" />
                  <Label htmlFor="ecocash">EcoCash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onemoney" id="onemoney" />
                  <Label htmlFor="onemoney">OneMoney</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0771234567"
              />
            </div>
          </>
        )}

        <Button 
          onClick={handleTestPayment}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Test Payment'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentTest;
