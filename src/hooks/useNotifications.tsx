
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      return (data || []) as Notification[];
    },
    enabled: !!user?.id,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (notification: {
      user_id: string;
      title: string;
      message: string;
      type: 'info' | 'warning' | 'error' | 'success';
    }) => {
      const { error } = await supabase
        .from('notifications')
        .insert([notification]);
      
      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification created",
        description: "The notification has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating notification",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
