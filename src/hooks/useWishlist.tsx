
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: number;
  created_at: string;
}

export const useWishlist = () => {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching wishlist for user:', user.id);
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
      }
      
      console.log('Wishlist items fetched:', data?.length || 0);
      return data as WishlistItem[];
    },
    enabled: !!user,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (productId: number) => {
      if (!user) {
        throw new Error('User must be logged in');
      }

      console.log('Adding to wishlist:', productId);
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist"
      });
    },
    onError: (error: any) => {
      console.error('Add to wishlist mutation error:', error);
      toast({
        title: "Error adding to wishlist",
        description: error.message || "Failed to add product to wishlist",
        variant: "destructive"
      });
    }
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (productId: number) => {
      if (!user) {
        throw new Error('User must be logged in');
      }

      console.log('Removing from wishlist:', productId);
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist"
      });
    },
    onError: (error: any) => {
      console.error('Remove from wishlist mutation error:', error);
      toast({
        title: "Error removing from wishlist",
        description: error.message || "Failed to remove product from wishlist",
        variant: "destructive"
      });
    }
  });
};
