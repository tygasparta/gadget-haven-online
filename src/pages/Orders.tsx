
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, RefreshCw, User, Calendar, DollarSign, MapPin, CreditCard, Phone } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrders } from '@/hooks/useOrders';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const Orders = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: orders = [], isLoading, refetch } = useOrders();
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/track-order?orderId=${orderId}`);
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
        {!isMobile && <Footer />}
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-4xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
          </div>
          
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card 
              key={order.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOrderClick(order)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">#{order.id.slice(-8).toUpperCase()}</CardTitle>
                    <p className="text-sm text-gray-600">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status || 'pending')} flex items-center space-x-1`}>
                    {getStatusIcon(order.status || 'pending')}
                    <span className="capitalize">{order.status?.replace('_', ' ') || 'pending'}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.products?.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"}
                          alt={item.products?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.products?.name || 'Unknown Product'}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">${Number(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No items found for this order
                    </div>
                  )}
                  
                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => handleTrackOrder(order.id, e)}
                    >
                      Track Order
                    </Button>
                    {(order.status === 'completed' || order.status === 'delivered') && (
                      <Button variant="outline" className="flex-1">
                        Leave Review
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">When you place orders, they'll appear here</p>
              <Button onClick={() => navigate('/')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Order Details - #{selectedOrder.id.slice(-8).toUpperCase()}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-600">Order Date</p>
                    </div>
                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-gray-600">Customer ID</p>
                    </div>
                    <p className="font-medium">{selectedOrder.user_id.slice(-12)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                    <p className="font-medium text-green-600 text-lg">${Number(selectedOrder.total_amount).toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <p className="text-sm text-gray-600">Payment Method</p>
                    </div>
                    <p className="font-medium">{selectedOrder.payment_method || 'Credit Card'}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(selectedOrder.status || 'pending')} flex items-center gap-1`}>
                      {getStatusIcon(selectedOrder.status || 'pending')}
                      {(selectedOrder.status || 'pending').charAt(0).toUpperCase() + (selectedOrder.status || 'pending').slice(1)}
                    </Badge>
                  </div>
                </div>

                <Separator />
                
                {/* Order Items */}
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Items ({selectedOrder.order_items.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded border">
                          <div className="flex items-center gap-4">
                            {item.products?.image && (
                              <img 
                                src={item.products.image} 
                                alt={item.products.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.products?.name || 'Unknown Product'}</p>
                              <p className="text-sm text-gray-600">Product ID: {item.product_id}</p>
                              <p className="text-sm text-blue-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${Number(item.price).toFixed(2)}</p>
                            <p className="text-sm text-gray-600">per item</p>
                            <p className="text-sm font-medium">
                              Total: ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Addresses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {selectedOrder.shipping_address && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Shipping Address
                      </h4>
                      <div className="space-y-2 text-sm">
                        {typeof selectedOrder.shipping_address === 'object' ? (
                          <>
                            <p className="font-medium">{selectedOrder.shipping_address.name || 'N/A'}</p>
                            <p className="text-gray-600">{selectedOrder.shipping_address.street || 'N/A'}</p>
                            <p className="text-gray-600">
                              {selectedOrder.shipping_address.city || 'N/A'}, {selectedOrder.shipping_address.state || 'N/A'} {selectedOrder.shipping_address.zipCode || 'N/A'}
                            </p>
                            <p className="text-gray-600">{selectedOrder.shipping_address.country || 'N/A'}</p>
                            {selectedOrder.shipping_address.phone && (
                              <p className="text-blue-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {selectedOrder.shipping_address.phone}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">Address information not available</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedOrder.billing_address && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Billing Address
                      </h4>
                      <div className="space-y-2 text-sm">
                        {typeof selectedOrder.billing_address === 'object' ? (
                          <>
                            <p className="font-medium">{selectedOrder.billing_address.name || 'N/A'}</p>
                            <p className="text-gray-600">{selectedOrder.billing_address.street || 'N/A'}</p>
                            <p className="text-gray-600">
                              {selectedOrder.billing_address.city || 'N/A'}, {selectedOrder.billing_address.state || 'N/A'} {selectedOrder.billing_address.zipCode || 'N/A'}
                            </p>
                            <p className="text-gray-600">{selectedOrder.billing_address.country || 'N/A'}</p>
                            {selectedOrder.billing_address.phone && (
                              <p className="text-blue-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {selectedOrder.billing_address.phone}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">Billing address same as shipping</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Timeline */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Order Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Order Created:</span>
                      <span className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{new Date(selectedOrder.updated_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="text-blue-600 font-medium">
                        {Math.ceil((new Date(selectedOrder.updated_at).getTime() - new Date(selectedOrder.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default Orders;
