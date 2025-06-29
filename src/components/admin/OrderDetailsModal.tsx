
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Phone,
  Mail,
  DollarSign,
  Hash
} from 'lucide-react';
import { Order } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'shipped': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-400" />
            Order Details - #{order.id.slice(-8).toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status and Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(order.status || 'pending')} flex items-center gap-2 px-3 py-1`}>
                    {getStatusIcon(order.status || 'pending')}
                    {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                  </Badge>
                  <div className="text-sm text-gray-400">
                    Last updated: {new Date(order.updated_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={order.status || 'pending'}
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating && (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Customer</p>
                    <p className="font-semibold">Customer {order.user_id.slice(-4)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="font-semibold text-green-400">${Number(order.total_amount).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          {order.order_items && order.order_items.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  Order Items ({order.order_items.length})
                </h3>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                      {item.products?.image && (
                        <img 
                          src={item.products.image} 
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.products?.name || 'Product'}</h4>
                        <p className="text-sm text-gray-400">Product ID: {item.product_id}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                          <span className="text-sm text-gray-400">Unit Price: ${Number(item.price).toFixed(2)}</span>
                          <span className="font-semibold text-green-400">
                            Total: ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Payment Method</p>
                  <p className="font-semibold">{order.payment_method || 'Card Payment'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payment Status</p>
                  <Badge className="bg-green-500 text-white">Paid</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Shipping Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    {typeof order.shipping_address === 'object' ? (
                      <div className="space-y-1">
                        <p className="font-semibold">{order.shipping_address.name || 'Name not provided'}</p>
                        <p>{order.shipping_address.street || 'Address not provided'}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                        {order.shipping_address.phone && (
                          <p className="flex items-center gap-2 text-gray-400">
                            <Phone className="w-4 h-4" />
                            {order.shipping_address.phone}
                          </p>
                        )}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-gray-300 text-xs bg-gray-700 p-3 rounded">
                        {JSON.stringify(order.shipping_address, null, 2)}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Address */}
            {order.billing_address && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-400" />
                    Billing Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    {typeof order.billing_address === 'object' ? (
                      <div className="space-y-1">
                        <p className="font-semibold">{order.billing_address.name || 'Name not provided'}</p>
                        <p>{order.billing_address.street || 'Address not provided'}</p>
                        <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</p>
                        {order.billing_address.phone && (
                          <p className="flex items-center gap-2 text-gray-400">
                            <Phone className="w-4 h-4" />
                            {order.billing_address.phone}
                          </p>
                        )}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-gray-300 text-xs bg-gray-700 p-3 rounded">
                        {JSON.stringify(order.billing_address, null, 2)}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
