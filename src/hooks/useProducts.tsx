
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string;
  category: string | null;
  brand: string | null;
  rating: number;
  reviews: number;
  stock: number;
  is_featured: boolean;
  is_flash_sale: boolean;
  discount_percentage: number;
  colors: Array<{name: string, hex_code: string}> | null;
  tags: string[] | null;
  whats_in_box: string[] | null;
  specifications: Array<{key: string, value: string}> | null;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching all products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched:', data?.length || 0);
      return data as Product[];
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product details for ID:', id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      
      // Ensure specifications are properly typed
      const processedProduct: Product = {
        ...data,
        specifications: data.specifications as Array<{key: string, value: string}> | null,
        colors: data.colors as Array<{name: string, hex_code: string}> | null,
      };
      
      console.log('Product fetched with specifications:', processedProduct.specifications?.length || 0);
      return processedProduct;
    },
    enabled: !!id,
  });
};

export const useFlashSaleProducts = () => {
  return useQuery({
    queryKey: ['flashSaleProducts'],
    queryFn: async () => {
      console.log('Fetching flash sale products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_flash_sale', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching flash sale products:', error);
        throw error;
      }
      
      console.log('Flash sale products fetched:', data?.length || 0);
      return data as Product[];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      console.log('Fetching featured products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
      }
      
      console.log('Featured products fetched:', data?.length || 0);
      return data as Product[];
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: number) => {
      console.log('Deleting product:', productId);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] });
      toast({
        title: "Product deleted",
        description: "The product has been removed from the catalog"
      });
    },
    onError: (error: any) => {
      console.error('Delete product mutation error:', error);
      toast({
        title: "Error deleting product",
        description: error.message || "Failed to delete product",
        variant: "destructive"
      });
    }
  });
};
