
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Truck, CreditCard } from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

interface OrderSummarySectionProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  finalTotal: number;
  paymentMethod: string;
  mobileMethod: string;
  isProcessing: boolean;
  onSubmit: () => void;
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  cartItems,
  subtotal,
  tax,
  shipping,
  finalTotal,
  paymentMethod,
  mobileMethod,
  isProcessing,
  onSubmit
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="sticky top-4 bg-white border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
              <Package className="w-4 h-4" />
              <span>{cartItems.length} Items</span>
            </div>
            
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative">
                  <img
                    src={item.products.image}
                    alt={item.products.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-blue-600 text-white"
                  >
                    {item.quantity}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.products.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${item.products.price.toFixed(2)} each
                  </p>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  ${(item.products.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Order Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (2%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Shipping</span>
              </div>
              <span className="font-medium">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <Separator />
            
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            {shipping === 0 && (
              <p className="text-xs text-green-600 text-center">
                🎉 You saved $3.50 on shipping!
              </p>
            )}
          </div>

          <Separator />

          {/* Payment Method Display */}
          <div className="flex items-center space-x-2 text-sm">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Payment:</span>
            <Badge variant="outline" className="capitalize">
              {paymentMethod === 'dischub' ? 'Dischub Payment' : 
               paymentMethod === 'cod' ? 'Cash on Delivery' : 
               mobileMethod || paymentMethod}
            </Badge>
          </div>

          {/* Action Button */}
          <Button
            onClick={onSubmit}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <span>Complete Order • ${finalTotal.toFixed(2)}</span>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>🔒 Your payment information is secure and encrypted</p>
            <p>✅ Tax calculated at checkout</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummarySection;
