
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUpdateOrderStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      console.log('Updating order status:', { orderId, status });
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }

      console.log('Order status updated successfully');
      return { orderId, status };
    },
    onSuccess: (data, { status }) => {
      console.log('Order update mutation succeeded');
      toast({
        title: "Order updated successfully",
        description: `Order status changed to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      });
      
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      console.error('Update order mutation error:', error);
      toast({
        title: "Error updating order",
        description: error.message || "Failed to update order status",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      console.log('Deleting order:', orderId);
      
      try {
        // First delete order items
        const { error: itemsError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderId);

        if (itemsError) {
          console.error('Error deleting order items:', itemsError);
          throw itemsError;
        }

        // Then delete the order
        const { error: orderError } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId);

        if (orderError) {
          console.error('Error deleting order:', orderError);
          throw orderError;
        }

        console.log('Order deleted successfully');
        return { orderId };
      } catch (error: any) {
        console.error('Delete order error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Order delete mutation succeeded');
      toast({
        title: "Order deleted successfully",
        description: "The order has been permanently removed",
      });
      
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      console.error('Delete order mutation error:', error);
      toast({
        title: "Error deleting order",
        description: error.message || "Failed to delete order",
        variant: "destructive"
      });
    }
  });
};
