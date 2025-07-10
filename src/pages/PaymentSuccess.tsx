
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Home, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from '@/components/MobileNavigation';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const clearCart = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Clear user's cart after successful payment
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    };

    clearCart();
  }, []);

  const orderReference = searchParams.get('reference') || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-2xl mx-auto px-4 py-16 ${isMobile ? 'pb-20' : ''}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  Thank you for your purchase! Your order has been confirmed and will be processed shortly.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Order Reference</p>
                  <p className="font-mono font-semibold text-gray-900">{orderReference}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-900">Processing</p>
                  <p className="text-sm text-blue-700">Your order is being prepared</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Receipt className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">Confirmation</p>
                  <p className="text-sm text-green-700">Email receipt sent</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/orders')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View My Orders
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Questions about your order?</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/contact')}
                  className="text-blue-600 p-0"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default PaymentSuccess;
