
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Hash,
  Edit,
  Save,
  X
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
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

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
        title: "Status Updated Successfully",
        description: `Order #${order.id.slice(-8).toUpperCase()} status changed to ${newStatus}`,
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
      setEditingStatus(false);
    } catch (error: any) {
      toast({
        title: "Error Updating Status",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white hover:bg-green-700';
      case 'shipped': return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'pending': return 'bg-yellow-600 text-white hover:bg-yellow-700';
      case 'cancelled': return 'bg-red-600 text-white hover:bg-red-700';
      default: return 'bg-gray-600 text-white hover:bg-gray-700';
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

  const orderTotal = order.order_items?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || Number(order.total_amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-400" />
            Order Details
            <Badge variant="outline" className="ml-2 text-sm">
              #{order.id.slice(-8).toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Management Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                Order Status Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Current Status:</p>
                    <Badge className={`${getStatusColor(order.status || 'pending')} flex items-center gap-2 px-4 py-2 text-sm font-semibold`}>
                      {getStatusIcon(order.status || 'pending')}
                      {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Last Updated:</p>
                    <p className="text-white font-medium">
                      {new Date(order.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {!editingStatus ? (
                    <Button
                      onClick={() => {
                        setEditingStatus(true);
                        setSelectedStatus(order.status || 'pending');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Change Status
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
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
                      <Button
                        onClick={() => handleStatusChange(selectedStatus)}
                        disabled={isUpdating || selectedStatus === order.status}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        {isUpdating ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() => setEditingStatus(false)}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="text-lg font-semibold text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Customer ID</p>
                    <p className="text-lg font-semibold text-white">...{order.user_id.slice(-8)}</p>
                    <p className="text-xs text-gray-500">User Account</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">Items Count</p>
                    <p className="text-lg font-semibold text-white">{order.order_items?.length || 0}</p>
                    <p className="text-xs text-gray-500">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-lg font-semibold text-green-400">${orderTotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Paid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          {order.order_items && order.order_items.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-400" />
                  Order Items ({order.order_items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <div className="flex-shrink-0">
                        {item.products?.image ? (
                          <img 
                            src={item.products.image} 
                            alt={item.products.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-white truncate">{item.products?.name || `Product ${item.product_id}`}</h4>
                        <p className="text-sm text-gray-400 mb-2">Product ID: #{item.product_id}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">Quantity:</span>
                            <Badge variant="outline" className="text-white">{item.quantity}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">Unit Price:</span>
                            <span className="text-white font-medium">${Number(item.price).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">Subtotal:</span>
                            <span className="text-green-400 font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4 bg-gray-600" />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-green-400">${orderTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment and Shipping Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-400" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                    <p className="text-white font-medium">{order.payment_method || 'Credit Card'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Payment Status</p>
                    <Badge className="bg-green-600 text-white">Paid</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Transaction Amount</p>
                  <p className="text-2xl font-bold text-green-400">${Number(order.total_amount).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Truck className="w-6 h-6 text-blue-400" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Shipping Status</p>
                    <Badge className={getStatusColor(order.status || 'pending')}>
                      {getStatusIcon(order.status || 'pending')}
                      <span className="ml-1">{(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}</span>
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Estimated Delivery</p>
                    <p className="text-white">
                      {order.status === 'shipped' ? '3-5 business days' : 
                       order.status === 'completed' ? 'Delivered' : 
                       'Pending processing'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-400" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {typeof order.shipping_address === 'object' ? (
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <p className="font-semibold text-white text-lg">{order.shipping_address.name || 'Recipient Name'}</p>
                          <p className="text-gray-300 mt-1">{order.shipping_address.street || 'Street Address'}</p>
                          <p className="text-gray-300">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                          {order.shipping_address.phone && (
                            <p className="flex items-center gap-2 text-gray-400 mt-2">
                              <Phone className="w-4 h-4" />
                              {order.shipping_address.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <pre className="whitespace-pre-wrap text-gray-300 text-sm">
                          {JSON.stringify(order.shipping_address, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Address */}
            {order.billing_address && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-green-400" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {typeof order.billing_address === 'object' ? (
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <p className="font-semibold text-white text-lg">{order.billing_address.name || 'Billing Name'}</p>
                          <p className="text-gray-300 mt-1">{order.billing_address.street || 'Street Address'}</p>
                          <p className="text-gray-300">{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</p>
                          {order.billing_address.phone && (
                            <p className="flex items-center gap-2 text-gray-400 mt-2">
                              <Phone className="w-4 h-4" />
                              {order.billing_address.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <pre className="whitespace-pre-wrap text-gray-300 text-sm">
                          {JSON.stringify(order.billing_address, null, 2)}
                        </pre>
                      </div>
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
