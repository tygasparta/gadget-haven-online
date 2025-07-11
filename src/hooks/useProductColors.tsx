
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductColor {
  id: string;
  name: string;
  hex_code: string;
  created_at: string;
}

export const useProductColors = () => {
  return useQuery({
    queryKey: ['productColors'],
    queryFn: async () => {
      console.log('Fetching product colors...');
      const { data, error } = await supabase
        .from('product_colors')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching product colors:', error);
        throw error;
      }
      
      console.log('Product colors fetched:', data?.length || 0);
      return data as ProductColor[];
    },
  });
};
