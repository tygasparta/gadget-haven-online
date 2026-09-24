
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Package, Search, CheckCircle, Clock, Truck, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { useOrderById } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const orderId = searchParams.get('orderId');
  const { data: orderData, isLoading, error } = useOrderById(orderId || '');

  useEffect(() => {
    if (orderId) {
      setOrderNumber(orderId.slice(-8).toUpperCase());
    }
  }, [orderId]);

  const getTrackingTimeline = (status: string, createdAt: string, updatedAt: string) => {
    const orderDate = new Date(createdAt);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
    
    const timeline = [
      { 
        status: 'Order Placed', 
        date: orderDate.toLocaleDateString(), 
        completed: true,
        description: 'Your order has been received and is being processed'
      },
      { 
        status: 'Payment Confirmed', 
        date: orderDate.toLocaleDateString(), 
        completed: true,
        description: 'Payment has been successfully processed'
      },
      { 
        status: 'Processing', 
        date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString(), 
        completed: status !== 'pending',
        description: 'Your order is being prepared for shipment'
      },
      { 
        status: 'Shipped', 
        date: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
        completed: ['shipped', 'in_transit', 'delivered', 'completed'].includes(status),
        description: 'Your order has been dispatched from our warehouse'
      },
      { 
        status: 'In Transit', 
        date: new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
        completed: ['in_transit', 'delivered', 'completed'].includes(status),
        description: 'Your package is on its way to you'
      },
      { 
        status: 'Out for Delivery', 
        date: new Date(orderDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
        completed: ['delivered', 'completed'].includes(status),
        description: 'Your package is out for delivery today'
      },
      { 
        status: 'Delivered', 
        date: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
        completed: ['delivered', 'completed'].includes(status),
        description: 'Your order has been successfully delivered'
      }
    ];

    return timeline;
  };

  const getEstimatedDelivery = (createdAt: string, status: string) => {
    const orderDate = new Date(createdAt);
    let deliveryDate;
    
    switch (status) {
      case 'delivered':
      case 'completed':
        deliveryDate = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
        break;
      case 'in_transit':
      case 'shipped':
        deliveryDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        break;
      default:
        deliveryDate = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
    }
    
    return deliveryDate.toLocaleDateString();
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // For manual search, we would typically make an API call
    // For now, we'll show a message that this feature needs backend implementation
    alert('Manual order tracking will be available soon. Please use the direct link from your orders page.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center flex-1">
            <Package className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Track Your Order</h1>
            <p className="text-xl text-muted-foreground">
              {orderId ? 'View your order details and tracking information' : 'Enter your order details below to track your shipment'}
            </p>
          </div>
        </div>

        {/* Show order details if we have orderData */}
        {orderData ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Order #{orderData.id.slice(-8).toUpperCase()}</CardTitle>
                    <p className="text-muted-foreground mt-2">
                      Placed on {new Date(orderData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="mb-2">
                      {orderData.status?.charAt(0).toUpperCase() + orderData.status?.slice(1).replace('_', ' ') || 'Pending'}
                    </Badge>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Est. delivery: {getEstimatedDelivery(orderData.created_at, orderData.status || 'pending')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {orderData.order_items?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img
                            src={item.products?.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"}
                            alt={item.products?.name || 'Product'}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.products?.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-sm">${Number(item.price).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${Number(orderData.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Shipping Address
                    </h3>
                    {orderData.shipping_address ? (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{orderData.shipping_address.fullName}</p>
                        <p>{orderData.shipping_address.address}</p>
                        <p>{orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zipCode}</p>
                        <p>{orderData.shipping_address.country}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No shipping address available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getTrackingTimeline(orderData.status || 'pending', orderData.created_at, orderData.updated_at).map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                            {step.status === 'Out for Delivery' ? (
                              <Truck className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <Clock className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.status}
                            </h3>
                            <p className={`text-sm ${step.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                              {step.description}
                            </p>
                          </div>
                          <span className={`text-sm ${step.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {step.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !orderId ? (
          /* Tracking Form for manual search */
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-foreground mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your order number (e.g., GG123456)"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the email used for your order"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Track Order
              </button>
            </form>
          </div>
        ) : (
          /* Error state */
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find an order with that ID. Please check your order number and try again.</p>
              <Button onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="bg-primary/10 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            If you're having trouble tracking your order or have questions about delivery, our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/contact" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-center">
              Contact Support
            </a>
            <a href="/help-centre" className="bg-white text-primary border border-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors text-center">
              Visit Help Centre
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
