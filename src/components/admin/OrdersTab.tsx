
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, User, Calendar, DollarSign, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const OrdersTab = () => {
  const { data: orders = [] } = useOrders();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order updated successfully",
        description: `Order status changed to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message || "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 hover:bg-green-700';
      case 'shipped': return 'bg-blue-600 hover:bg-blue-700';
      case 'pending': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'cancelled': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
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

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Shipped</p>
                <p className="text-2xl font-bold text-blue-400">{stats.shipped}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Cancelled</p>
                <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold">Order Management</h3>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-full md:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white w-full md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="text-gray-300">Order ID</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Items</TableHead>
                  <TableHead className="text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Payment</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="font-medium text-white">
                        #{order.id.slice(-8).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer {order.user_id.slice(-4)}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {order.order_items?.length || 0} items
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      ${Number(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status || 'pending')} text-white flex items-center gap-1 w-fit`}>
                        {getStatusIcon(order.status || 'pending')}
                        {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {order.payment_method || 'Card'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">
                                Order Details - #{order.id.slice(-8).toUpperCase()}
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-6">
                              {/* Order Summary */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    <p className="text-sm text-gray-400">Order Date</p>
                                  </div>
                                  <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-green-400" />
                                    <p className="text-sm text-gray-400">Customer ID</p>
                                  </div>
                                  <p className="font-medium">{order.user_id.slice(-12)}</p>
                                </div>
                                
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-yellow-400" />
                                    <p className="text-sm text-gray-400">Total Amount</p>
                                  </div>
                                  <p className="font-medium text-green-400 text-lg">${Number(order.total_amount).toFixed(2)}</p>
                                </div>
                                
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="w-4 h-4 text-purple-400" />
                                    <p className="text-sm text-gray-400">Payment Method</p>
                                  </div>
                                  <p className="font-medium">{order.payment_method || 'Credit Card'}</p>
                                </div>
                              </div>

                              {/* Status Management */}
                              <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Package className="w-5 h-5" />
                                  Order Status Management
                                </h4>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Current Status:</span>
                                    <Badge className={`${getStatusColor(order.status || 'pending')} text-white flex items-center gap-1`}>
                                      {getStatusIcon(order.status || 'pending')}
                                      {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Update to:</span>
                                    <Select
                                      value={order.status || 'pending'}
                                      onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                                      disabled={updatingStatus}
                                    >
                                      <SelectTrigger className="bg-gray-700 text-white text-sm border-gray-600 w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-800 border-gray-700">
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              <Separator className="bg-gray-700" />
                              
                              {/* Order Items */}
                              {order.order_items && order.order_items.length > 0 && (
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Order Items ({order.order_items.length})
                                  </h4>
                                  <div className="space-y-3">
                                    {order.order_items.map((item) => (
                                      <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded border border-gray-700">
                                        <div className="flex items-center gap-4">
                                          {item.products?.image && (
                                            <img 
                                              src={item.products.image} 
                                              alt={item.products.name}
                                              className="w-16 h-16 object-cover rounded border border-gray-600"
                                            />
                                          )}
                                          <div>
                                            <p className="font-medium text-white">{item.products?.name || 'Unknown Product'}</p>
                                            <p className="text-sm text-gray-400">Product ID: {item.product_id}</p>
                                            <p className="text-sm text-blue-400">Quantity: {item.quantity}</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium text-green-400">${Number(item.price).toFixed(2)}</p>
                                          <p className="text-sm text-gray-400">per item</p>
                                          <p className="text-sm font-medium text-white">
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
                                {order.shipping_address && (
                                  <div className="bg-white/5 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <MapPin className="w-5 h-5 text-blue-400" />
                                      Shipping Address
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      {typeof order.shipping_address === 'object' ? (
                                        <>
                                          <p className="text-white">{order.shipping_address.name || 'N/A'}</p>
                                          <p className="text-gray-300">{order.shipping_address.street || 'N/A'}</p>
                                          <p className="text-gray-300">
                                            {order.shipping_address.city || 'N/A'}, {order.shipping_address.state || 'N/A'} {order.shipping_address.zipCode || 'N/A'}
                                          </p>
                                          <p className="text-gray-300">{order.shipping_address.country || 'N/A'}</p>
                                          {order.shipping_address.phone && (
                                            <p className="text-blue-400 flex items-center gap-1">
                                              <Phone className="w-3 h-3" />
                                              {order.shipping_address.phone}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <p className="text-gray-400">Address information not available</p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {order.billing_address && (
                                  <div className="bg-white/5 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                      <CreditCard className="w-5 h-5 text-green-400" />
                                      Billing Address
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      {typeof order.billing_address === 'object' ? (
                                        <>
                                          <p className="text-white">{order.billing_address.name || 'N/A'}</p>
                                          <p className="text-gray-300">{order.billing_address.street || 'N/A'}</p>
                                          <p className="text-gray-300">
                                            {order.billing_address.city || 'N/A'}, {order.billing_address.state || 'N/A'} {order.billing_address.zipCode || 'N/A'}
                                          </p>
                                          <p className="text-gray-300">{order.billing_address.country || 'N/A'}</p>
                                          {order.billing_address.phone && (
                                            <p className="text-blue-400 flex items-center gap-1">
                                              <Phone className="w-3 h-3" />
                                              {order.billing_address.phone}
                                            </p>
                                          )}
                                        </>
                                      ) : (
                                        <p className="text-gray-400">Billing address same as shipping</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Order Timeline */}
                              <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-yellow-400" />
                                  Order Timeline
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Order Created:</span>
                                    <span className="text-white">{new Date(order.created_at).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Last Updated:</span>
                                    <span className="text-white">{new Date(order.updated_at).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Processing Time:</span>
                                    <span className="text-blue-400">
                                      {Math.ceil((new Date(order.updated_at).getTime() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Select
                          value={order.status || 'pending'}
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          disabled={updatingStatus}
                        >
                          <SelectTrigger className="bg-gray-700 text-white text-sm border-gray-600 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No orders found</p>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTab;
