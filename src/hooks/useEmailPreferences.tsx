
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

  return useQuery({
    queryKey: ['email-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
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
    enabled: !!user?.id,
  });
};

export const useUpdateEmailPreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (preferences: Partial<EmailPreferences>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('email_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
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
        title: "Email preferences updated",
        description: "Your email notification settings have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useEmailQueue = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['email-queue', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('email_queue')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching email queue:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useProcessEmails = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('send-email');
      
      if (error) {
        console.error('Error processing emails:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Email processing completed",
        description: `Processed ${data?.results?.length || 0} emails.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error processing emails",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
