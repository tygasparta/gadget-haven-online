
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
      
      // Process specifications to ensure they're properly typed
      const processedProducts = data?.map(product => ({
        ...product,
        specifications: product.specifications as Array<{key: string, value: string}> | null,
        colors: product.colors as Array<{name: string, hex_code: string}> | null,
      })) || [];
      
      console.log('Products fetched:', processedProducts.length);
      console.log('Sample product with specs:', processedProducts[0]?.specifications);
      return processedProducts as Product[];
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
      
      // Ensure specifications are properly typed and processed
      const processedProduct: Product = {
        ...data,
        specifications: data.specifications as Array<{key: string, value: string}> | null,
        colors: data.colors as Array<{name: string, hex_code: string}> | null,
      };
      
      console.log('Product fetched with specifications:', processedProduct.specifications?.length || 0);
      console.log('Product specifications:', processedProduct.specifications);
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
      
      // With CASCADE delete, we can simply delete the product
      // All related records will be automatically deleted
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      console.log('Product deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast({
        title: "Product deleted",
        description: "The product and all related data have been permanently removed"
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
