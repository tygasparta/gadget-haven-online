
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import usePaynow from '@/hooks/usePaynow';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

const PaymentTest = () => {
  const [amount, setAmount] = useState('10.00');
  const [email, setEmail] = useState('test@example.com');
  const [phoneNumber, setPhoneNumber] = useState('0771234567');
  const [paymentMethod, setPaymentMethod] = useState('web');
  const [mobileMethod, setMobileMethod] = useState('ecocash');
  
  const { initiateWebPayment, initiateMobilePayment, isProcessing } = usePaynow();
  const { toast } = useToast();
  const { user } = useAuthContext();

  const handleTestPayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to test payments",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a test order first
      const orderData = {
        user_id: user.id,
        total_amount: parseFloat(amount),
        status: 'pending',
        payment_method: paymentMethod === 'web' ? 'paynow_web' : `paynow_${mobileMethod}`,
        shipping_address: {
          firstName: 'Test',
          lastName: 'User',
          address: '123 Test Street',
          city: 'Test City',
          zipCode: '12345',
          country: 'Zimbabwe'
        },
        billing_address: {
          firstName: 'Test',
          lastName: 'User',
          address: '123 Test Street',
          city: 'Test City',
          zipCode: '12345',
          country: 'Zimbabwe'
        }
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Error creating test order:', orderError);
        toast({
          title: "Order Creation Failed",
          description: "Failed to create test order",
          variant: "destructive"
        });
        return;
      }

      console.log('Test order created:', order.id);

      const paymentData = {
        reference: `TEST-ORDER-${order.id}`,
        amount: parseFloat(amount),
        email: email,
        additionalInfo: 'Test Payment'
      };

      if (paymentMethod === 'web') {
        await initiateWebPayment(paymentData, order.id);
      } else if (paymentMethod === 'mobile') {
        await initiateMobilePayment(paymentData, phoneNumber, mobileMethod as 'ecocash' | 'onemoney', order.id);
      }
    } catch (error) {
      console.error('Test payment error:', error);
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
        <p className="text-sm text-gray-600">
          {user ? `Testing as: ${user.email}` : 'Please log in to test payments'}
        </p>
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
          disabled={isProcessing || !user}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Test Payment'}
        </Button>

        {!user && (
          <p className="text-sm text-amber-600 text-center">
            Please log in to test payment functionality
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentTest;
