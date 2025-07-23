
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EmailPreferences {
  id: string;
  user_id: string;
  order_confirmations: boolean;
  order_status_updates: boolean;
  shipping_notifications: boolean;
  promotional_emails: boolean;
  newsletter: boolean;
  created_at: string;
  updated_at: string;
}

export const useEmailPreferences = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['email-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        const { data, error } = await supabase
          .rpc('get_email_preferences', { user_id: user.id });

        if (error) {
          console.error('Error fetching email preferences:', error);
          // Return default preferences if function doesn't exist yet
          return {
            id: 'default',
            user_id: user.id,
            order_confirmations: true,
            order_status_updates: true,
            shipping_notifications: true,
            promotional_emails: true,
            newsletter: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as EmailPreferences;
        }

        return data as EmailPreferences;
      } catch (err) {
        console.error('RPC call failed:', err);
        // Return default preferences if RPC fails
        return {
          id: 'default',
          user_id: user.id,
          order_confirmations: true,
          order_status_updates: true,
          shipping_notifications: true,
          promotional_emails: true,
          newsletter: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as EmailPreferences;
      }
    },
    enabled: !!user,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<EmailPreferences>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        const { data, error } = await supabase
          .rpc('update_email_preferences', {
            user_id: user.id,
            preferences: updates,
          });

        if (error) {
          console.error('Error updating email preferences:', error);
          throw error;
        }

        return data;
      } catch (err) {
        console.error('Failed to update preferences:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-preferences', user?.id] });
      toast({
        title: "Success",
        description: "Email preferences updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update email preferences",
        variant: "destructive",
      });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
};

export const useEmailQueue = () => {
  const { user } = useAuthContext();

  const { data: emailQueue, isLoading, refetch } = useQuery({
    queryKey: ['email-queue', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .rpc('get_email_queue', { user_id: user.id });

        if (error) {
          console.error('Error fetching email queue:', error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error('RPC call failed:', err);
        return [];
      }
    },
    enabled: !!user,
  });

  const processEmailsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {},
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    emailQueue,
    isLoading,
    refetch,
    processEmails: processEmailsMutation.mutate,
    isProcessing: processEmailsMutation.isPending,
  };
};
