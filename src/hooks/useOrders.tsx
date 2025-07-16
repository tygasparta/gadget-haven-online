
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  shipping_address: any;
  billing_address: any;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  products: {
    id: number;
    name: string;
    image: string;
  };
}

export const useOrders = () => {
  const { user } = useAuthContext();
  const { isAdmin } = useUserRole();
  
  return useQuery({
    queryKey: ['orders', user?.id, isAdmin],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching orders for user:', user.id, 'isAdmin:', isAdmin);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products:product_id (
              id,
              name,
              image
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      // If not admin, only fetch user's own orders
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      console.log('Fetched orders:', data);
      return data as Order[];
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

export const useOrderById = (orderId: string) => {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products:product_id (
              id,
              name,
              image,
              price
            )
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as Order;
    },
    enabled: !!user && !!orderId,
  });
};
