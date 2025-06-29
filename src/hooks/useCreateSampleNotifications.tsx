
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreateSampleNotifications = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const sampleNotifications = [
        {
          user_id: user.id,
          title: 'Welcome to Gadget Genie!',
          message: 'Thank you for joining our platform. Explore our amazing products and deals.',
          type: 'success'
        },
        {
          user_id: user.id,
          title: 'Low Stock Alert',
          message: 'Several products are running low on stock. Please check inventory.',
          type: 'warning'
        },
        {
          user_id: user.id,
          title: 'New Order Received',
          message: 'You have received a new order #12345. Please process it soon.',
          type: 'info'
        },
        {
          user_id: user.id,
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight from 2-4 AM.',
          type: 'info'
        }
      ];

      // Using any type temporarily until Supabase types are regenerated
      const { error } = await (supabase as any)
        .from('notifications')
        .insert(sampleNotifications);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Sample notifications created",
        description: "You can now see notifications in the dropdown.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating notifications",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
