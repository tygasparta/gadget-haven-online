
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Edit } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const OrdersTab = () => {
  const { data: orders = [] } = useOrders();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'shipped': return 'bg-blue-600';
      case 'pending': return 'bg-yellow-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Order Management</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-4 text-gray-300">Order ID</th>
                <th className="text-left p-4 text-gray-300">Date</th>
                <th className="text-left p-4 text-gray-300">Customer</th>
                <th className="text-left p-4 text-gray-300">Total</th>
                <th className="text-left p-4 text-gray-300">Status</th>
                <th className="text-left p-4 text-gray-300">Payment</th>
                <th className="text-left p-4 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4">
                    <p className="font-medium text-white">#ORD-{order.id.slice(-8)}</p>
                  </td>
                  <td className="p-4 text-gray-300">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-300">
                    Customer {order.user_id.slice(-4)}
                  </td>
                  <td className="p-4 text-white font-medium">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(order.status || 'pending')}>
                      {order.status || 'pending'}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-300">
                    {order.payment_method || 'Card'}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-blue-600 hover:bg-blue-700 border-blue-500">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
