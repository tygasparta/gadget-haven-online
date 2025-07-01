
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, User, Calendar, DollarSign, MapPin, CreditCard, Phone, Mail, MoreHorizontal, Edit, Trash2, Download, RefreshCw } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order deleted successfully",
        description: "The order has been permanently removed",
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error: any) {
      toast({
        title: "Error deleting order",
        description: error.message || "Failed to delete order",
        variant: "destructive"
      });
    }
  };

  const exportOrderData = (order: any) => {
    const orderData = {
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString(),
      customer: order.user_id,
      total: order.total_amount,
      status: order.status,
      items: order.order_items?.length || 0
    };
    
    const dataStr = JSON.stringify(orderData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `order-${order.id.slice(-8)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Order exported",
      description: "Order data has been downloaded as JSON file",
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'shipped': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'pending': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'cancelled': return 'bg-red-600 hover:bg-red-700 text-white';
      default: return 'bg-gray-600 hover:bg-gray-700 text-white';
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
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border-blue-400/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm border-yellow-400/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-200">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border-blue-400/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">Shipped</p>
                <p className="text-2xl font-bold text-blue-400">{stats.shipped}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border-green-400/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-200">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border-red-400/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-200">Cancelled</p>
                <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 backdrop-blur-sm border-emerald-400/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-200">Revenue</p>
                <p className="text-2xl font-bold text-emerald-400">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Order Management</h3>
              <p className="text-gray-400 mt-1">Manage and track all customer orders</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by Order ID or Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 w-full md:w-80 focus:border-blue-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white w-full md:w-40 focus:border-blue-400">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">All Orders</SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-gray-700">Pending</SelectItem>
                  <SelectItem value="shipped" className="text-white hover:bg-gray-700">Shipped</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-gray-700">Completed</SelectItem>
                  <SelectItem value="cancelled" className="text-white hover:bg-gray-700">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50 bg-gray-800/50">
                  <TableHead className="text-gray-300 font-semibold">Order ID</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Date</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Customer</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Items</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Total</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Payment</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-gray-700/30 hover:bg-gray-800/40 transition-colors">
                    <TableCell>
                      <div className="font-mono text-blue-400 font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Customer {order.user_id.slice(-4)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 font-medium">
                      {order.order_items?.length || 0} items
                    </TableCell>
                    <TableCell>
                      <span className="text-green-400 font-bold text-lg">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status || 'pending')} flex items-center gap-1 w-fit font-medium`}>
                        {getStatusIcon(order.status || 'pending')}
                        {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{order.payment_method || 'Card'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white font-medium"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
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
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white font-medium"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            className="bg-gray-800 border-gray-600 text-white min-w-[160px]" 
                            align="end"
                          >
                            <DropdownMenuLabel className="text-gray-300 font-semibold">
                              Order Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-600" />
                            
                            <DropdownMenuItem 
                              className="text-white hover:bg-gray-700 cursor-pointer"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="text-white hover:bg-gray-700 cursor-pointer"
                              onClick={() => exportOrderData(order)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export Data
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-gray-600" />
                            
                            <DropdownMenuItem 
                              className="text-blue-400 hover:bg-gray-700 cursor-pointer"
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              disabled={order.status === 'shipped'}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Mark as Shipped
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="text-green-400 hover:bg-gray-700 cursor-pointer"
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              disabled={order.status === 'completed'}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Completed
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-gray-600" />
                            
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-red-900/50 cursor-pointer"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTab;
