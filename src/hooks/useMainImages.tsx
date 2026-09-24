import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/** One request for every product's gallery cover image (main image, else first by order). */
export const useMainImages = () =>
  useQuery({
    queryKey: ['product-main-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_galleries')
        .select('product_id, image_url, is_main, display_order')
        .order('display_order', { ascending: true });
      if (error) throw error;
      const map: Record<number, string> = {};
      for (const row of data || []) {
        if (!row.image_url) continue;
        if (row.is_main || !(row.product_id in map)) map[row.product_id] = row.image_url;
      }
      // main wins over first-by-order
      for (const row of data || []) if (row.is_main && row.image_url) map[row.product_id] = row.image_url;
      return map;
    },
    staleTime: 5 * 60 * 1000,
  });
