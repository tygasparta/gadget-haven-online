
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
  deleted_at: string | null;
  is_trashed: boolean;
}

export const useProducts = (includeDeleted = false) => {
  return useQuery({
    queryKey: ['products', includeDeleted],
    queryFn: async () => {
      console.log('Fetching products..., includeDeleted:', includeDeleted);
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If not including deleted, filter them out
      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      // Process specifications to ensure they're properly typed and add is_trashed computed property
      const processedProducts = data?.map(product => ({
        ...product,
        specifications: product.specifications as Array<{key: string, value: string}> | null,
        colors: product.colors as Array<{name: string, hex_code: string}> | null,
        is_trashed: !!product.deleted_at,
      })) || [];
      
      console.log('Products fetched:', processedProducts.length);
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
        .is('deleted_at', null)
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
        .is('deleted_at', null)
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
      console.log('Soft deleting product:', productId);
      
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) {
        console.error('Error soft deleting product:', error);
        throw error;
      }

      console.log('Product soft deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] });
      toast({
        title: "Product moved to trash",
        description: "The product has been moved to trash and can be restored"
      });
    },
    onError: (error: any) => {
      console.error('Delete product mutation error:', error);
      toast({
        title: "Error moving product to trash",
        description: error.message || "Failed to move product to trash",
        variant: "destructive"
      });
    }
  });
};

export const useRestoreProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: number) => {
      console.log('Restoring product:', productId);
      
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: null })
        .eq('id', productId);

      if (error) {
        console.error('Error restoring product:', error);
        throw error;
      }

      console.log('Product restored successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] });
      toast({
        title: "Product restored",
        description: "The product has been restored successfully"
      });
    },
    onError: (error: any) => {
      console.error('Restore product mutation error:', error);
      toast({
        title: "Error restoring product",
        description: error.message || "Failed to restore product",
        variant: "destructive"
      });
    }
  });
};

export const usePermanentDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: number) => {
      console.log('Permanently deleting product:', productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error permanently deleting product:', error);
        throw error;
      }

      console.log('Product permanently deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast({
        title: "Product permanently deleted",
        description: "The product has been permanently removed from the database"
      });
    },
    onError: (error: any) => {
      console.error('Permanent delete product mutation error:', error);
      toast({
        title: "Error permanently deleting product",
        description: error.message || "Failed to permanently delete product",
        variant: "destructive"
      });
    }
  });
};
