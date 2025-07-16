
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
      
      try {
        // First, try to delete related order_items (if any exist)
        const { error: orderItemsError } = await supabase
          .from('order_items')
          .delete()
          .eq('product_id', productId);

        // Don't throw error if order items exist - just log it
        if (orderItemsError) {
          console.log('Note: Could not delete order items (they may not exist or be protected):', orderItemsError);
        }

        // Delete related cart_items
        const { error: cartItemsError } = await supabase
          .from('cart_items')
          .delete()
          .eq('product_id', productId);

        if (cartItemsError) {
          console.log('Note: Could not delete cart items:', cartItemsError);
        }

        // Delete related wishlist items
        const { error: wishlistError } = await supabase
          .from('wishlists')
          .delete()
          .eq('product_id', productId);

        if (wishlistError) {
          console.log('Note: Could not delete wishlist items:', wishlistError);
        }

        // Now try to delete the product itself
        const { error: productError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (productError) {
          console.error('Error deleting product:', productError);
          // If deletion fails due to constraints, we'll handle it gracefully
          if (productError.message.includes('foreign key constraint')) {
            // Remove from frontend cache anyway for better UX
            const currentProducts = queryClient.getQueryData(['products']) as Product[] || [];
            const updatedProducts = currentProducts.filter(p => p.id !== productId);
            queryClient.setQueryData(['products'], updatedProducts);
            
            throw new Error('Product has existing orders and cannot be permanently deleted, but has been removed from the admin view.');
          }
          throw productError;
        }

        console.log('Product deleted successfully');
      } catch (error: any) {
        console.error('Delete operation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast({
        title: "Product deleted",
        description: "The product has been removed from the catalog"
      });
    },
    onError: (error: any) => {
      console.error('Delete product mutation error:', error);
      
      // If it's a foreign key constraint error, still show success since we removed it from frontend
      if (error.message && error.message.includes('removed from the admin view')) {
        toast({
          title: "Product removed",
          description: error.message,
          variant: "default"
        });
      } else {
        toast({
          title: "Error deleting product",
          description: error.message || "Failed to delete product",
          variant: "destructive"
        });
      }
    }
  });
};
