
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import Header from '@/components/Header';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};

  React.useEffect(() => {
    // If no order data, redirect to home
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Order Number</h3>
                <p className="text-blue-600 font-mono text-lg">#{orderId?.slice(0, 8) || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Total Amount</h3>
                <p className="text-green-600 font-bold text-xl">${total?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="text-center p-6">
              <Package className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">Your order is being prepared</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center p-6">
              <Truck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Shipping</h3>
              <p className="text-sm text-gray-600">Expected delivery in 3-5 business days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center p-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Confirmation</h3>
              <p className="text-sm text-gray-600">Order confirmation sent to your email</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We'll send you tracking information once your order ships.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              View Order History
            </Button>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
