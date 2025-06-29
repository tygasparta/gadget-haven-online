
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

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
  
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
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
