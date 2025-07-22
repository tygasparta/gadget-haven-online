
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Smartphone, Package, Truck, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem } from '@/hooks/useCart';

interface OrderSummarySectionProps {
  cartItems: CartItem[];
  totalPrice: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  paymentMethod: string;
  mobileMethod: string;
  isProcessing: boolean;
  onSubmit: () => void;
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  cartItems,
  totalPrice,
  shipping,
  tax,
  finalTotal,
  paymentMethod,
  mobileMethod,
  isProcessing,
  onSubmit
}) => {
  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'web': return <Shield className="w-5 h-5 text-green-600" />;
      case 'mobile': return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'cod': return <Package className="w-5 h-5 text-orange-600" />;
      default: return <Shield className="w-5 h-5 text-green-600" />;
    }
  };

  const getPaymentText = () => {
    switch (paymentMethod) {
      case 'web': return 'Secure payment via Paynow';
      case 'mobile': return `Mobile payment via ${mobileMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'}`;
      case 'cod': return 'Pay cash on delivery';
      default: return 'Secure payment via Paynow';
    }
  };

  const getPaymentBgColor = () => {
    switch (paymentMethod) {
      case 'web': return 'bg-green-50 border-green-200';
      case 'mobile': return 'bg-blue-50 border-blue-200';
      case 'cod': return 'bg-orange-50 border-orange-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="sticky top-4 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-gray-800">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
            </div>
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.products.image} 
                    alt={item.products.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-800">{item.products.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">
                  ${(item.products.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-800">Total</span>
            <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ${finalTotal.toFixed(2)}
            </span>
          </div>

          {/* Payment Info */}
          <div className={`${getPaymentBgColor()} border rounded-xl p-4 flex items-center space-x-3`}>
            {getPaymentIcon()}
            <span className="text-sm font-medium text-gray-700">{getPaymentText()}</span>
          </div>

          {/* Shipping Info */}
          {totalPrice >= 50 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">FREE shipping included! 🎉</span>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center space-x-3">
              <Truck className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">
                Add <span className="font-semibold">${(50 - totalPrice).toFixed(2)}</span> more for FREE shipping
              </span>
            </div>
          )}

          {/* Complete Order Button */}
          <Button 
            onClick={onSubmit}
            disabled={isProcessing}
            className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>
                  {paymentMethod === 'cod' ? 'Confirm Order' : 'Complete Order'} - ${finalTotal.toFixed(2)}
                </span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummarySection;
