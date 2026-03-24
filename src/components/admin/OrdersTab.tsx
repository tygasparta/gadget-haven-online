import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, User, Calendar, DollarSign, MapPin, CreditCard, Phone, MoreHorizontal, Trash2, Download, RefreshCw, MessageSquare } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useUpdateOrderStatus, useDeleteOrder } from '@/hooks/useOrderManagement';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const OrdersTab = () => {
  const { data: orders = [], isLoading, refetch } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    updateOrderStatus.mutate({ orderId, status });
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    deleteOrder.mutate(orderId);
  };

  const exportOrderData = (order: any) => {
    const dataStr = JSON.stringify({ id: order.id, date: new Date(order.created_at).toLocaleDateString(), total: order.total_amount, status: order.status, items: order.order_items?.length || 0, shipping_address: order.shipping_address, payment_method: order.payment_method }, null, 2);
    const link = document.createElement('a');
    link.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr));
    link.setAttribute('download', `order-${order.id.slice(-8)}.json`);
    link.click();
    toast({ title: "Order exported", description: "Order data downloaded as JSON" });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) || (order as any).customer_phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || (order as any).source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
  };

  const statCards = [
    { label: 'Total Orders', value: stats.total, icon: Package, iconBg: 'bg-accent text-primary' },
    { label: 'Pending', value: stats.pending, icon: Clock, iconBg: 'bg-amber-50 text-amber-600' },
    { label: 'Shipped', value: stats.shipped, icon: Truck, iconBg: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, iconBg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Cancelled', value: stats.cancelled, icon: XCircle, iconBg: 'bg-red-50 text-red-600' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, iconBg: 'bg-emerald-50 text-emerald-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${s.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders Management */}
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Order Management</h3>
              <p className="text-muted-foreground text-sm mt-1">Manage and track all customer orders</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder="Search by Order ID or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full md:w-80" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Filter by source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Source</TableHead>
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <span className="font-mono text-primary font-medium text-sm">#{order.id.slice(-8).toUpperCase()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Customer {order.user_id.slice(-4)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.order_items?.length || 0} items</TableCell>
                    <TableCell>
                      <span className="font-semibold text-emerald-600">${Number(order.total_amount).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${getStatusBadgeClasses(order.status || 'pending')} flex items-center gap-1 w-fit text-xs`}>
                        {getStatusIcon(order.status || 'pending')}
                        {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{order.payment_method || 'Card'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="w-3.5 h-3.5 mr-1" />View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - #{order.id.slice(-8).toUpperCase()}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Order Date</p></div>
                                  <p className="font-medium text-sm">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2"><User className="w-4 h-4 text-emerald-600" /><p className="text-sm text-muted-foreground">Customer ID</p></div>
                                  <p className="font-medium text-sm">{order.user_id.slice(-12)}</p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-amber-600" /><p className="text-sm text-muted-foreground">Total</p></div>
                                  <p className="font-semibold text-emerald-600">${Number(order.total_amount).toFixed(2)}</p>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4 text-violet-600" /><p className="text-sm text-muted-foreground">Payment</p></div>
                                  <p className="font-medium text-sm">{order.payment_method || 'Credit Card'}</p>
                                </div>
                              </div>

                              <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm"><Package className="w-4 h-4" />Status Management</h4>
                                <div className="flex flex-wrap items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Current:</span>
                                    <Badge variant="secondary" className={`${getStatusBadgeClasses(order.status || 'pending')} flex items-center gap-1`}>
                                      {getStatusIcon(order.status || 'pending')}
                                      {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Update:</span>
                                    <Select value={order.status || 'pending'} onValueChange={(value) => handleUpdateOrderStatus(order.id, value)} disabled={updateOrderStatus.isPending}>
                                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {order.order_items && order.order_items.length > 0 && (
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm"><Package className="w-4 h-4" />Order Items ({order.order_items.length})</h4>
                                  <div className="space-y-3">
                                    {order.order_items.map((item) => (
                                      <div key={item.id} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border">
                                        <div className="flex items-center gap-4">
                                          {item.products?.image && <img src={item.products.image} alt={item.products.name} className="w-14 h-14 object-cover rounded border border-border" />}
                                          <div>
                                            <p className="font-medium text-sm">{item.products?.name || 'Unknown Product'}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium text-emerald-600 text-sm">${Number(item.price).toFixed(2)}</p>
                                          <p className="text-xs text-muted-foreground">Total: ${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {order.shipping_address && (
                                  <div className="bg-muted/50 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-primary" />Shipping Address</h4>
                                    {typeof order.shipping_address === 'object' ? (
                                      <div className="space-y-1 text-sm">
                                        <p>{order.shipping_address.name || 'N/A'}</p>
                                        <p className="text-muted-foreground">{order.shipping_address.street || 'N/A'}</p>
                                        <p className="text-muted-foreground">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                                        {order.shipping_address.phone && <p className="text-primary flex items-center gap-1"><Phone className="w-3 h-3" />{order.shipping_address.phone}</p>}
                                      </div>
                                    ) : <p className="text-sm text-muted-foreground">Not available</p>}
                                  </div>
                                )}
                                {order.billing_address && (
                                  <div className="bg-muted/50 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4 text-emerald-600" />Billing Address</h4>
                                    {typeof order.billing_address === 'object' ? (
                                      <div className="space-y-1 text-sm">
                                        <p>{order.billing_address.name || 'N/A'}</p>
                                        <p className="text-muted-foreground">{order.billing_address.street || 'N/A'}</p>
                                        <p className="text-muted-foreground">{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zipCode}</p>
                                      </div>
                                    ) : <p className="text-sm text-muted-foreground">Same as shipping</p>}
                                  </div>
                                )}
                              </div>

                              <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-amber-600" />Timeline</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between"><span className="text-muted-foreground">Created:</span><span>{new Date(order.created_at).toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Updated:</span><span>{new Date(order.updated_at).toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Processing:</span><span className="text-primary">{Math.ceil((new Date(order.updated_at).getTime() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24))} days</span></div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" disabled={updateOrderStatus.isPending || deleteOrder.isPending}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportOrderData(order)}><Download className="w-4 h-4 mr-2" />Export Data</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'shipped')} disabled={order.status === 'shipped' || order.status === 'completed'}>
                              <Truck className="w-4 h-4 mr-2" />Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'completed')} disabled={order.status === 'completed'}>
                              <CheckCircle className="w-4 h-4 mr-2" />Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />Delete Order
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
              <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTab;
