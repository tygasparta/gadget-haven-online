
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
      
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching email preferences:', error);
        throw error;
      }

      return data as EmailPreferences;
    },
    enabled: !!user,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<EmailPreferences>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('email_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating email preferences:', error);
        throw error;
      }

      return data;
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
      
      const { data, error } = await supabase
        .from('email_queue')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching email queue:', error);
        throw error;
      }

      return data || [];
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
