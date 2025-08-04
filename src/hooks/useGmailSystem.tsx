
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gmailService } from '@/services/gmailService';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useGmailSystem = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queueEmailMutation = useMutation({
    mutationFn: gmailService.queueEmail,
    onSuccess: () => {
      toast({
        title: "Email Queued",
        description: "Email has been queued for sending via Gmail",
      });
      queryClient.invalidateQueries({ queryKey: ['email-queue'] });
    },
    onError: (error) => {
      console.error('Error queueing email:', error);
      toast({
        title: "Error",
        description: "Failed to queue email",
        variant: "destructive",
      });
    },
  });

  const processEmailsMutation = useMutation({
    mutationFn: gmailService.processEmailQueue,
    onSuccess: (data) => {
      toast({
        title: "Emails Processed",
        description: `Processed ${data.processed} emails via Gmail`,
      });
      queryClient.invalidateQueries({ queryKey: ['email-queue'] });
    },
    onError: (error) => {
      console.error('Error processing emails:', error);
      toast({
        title: "Error",
        description: "Failed to process email queue",
        variant: "destructive",
      });
    },
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: gmailService.getEmailTemplates,
  });

  const sendWelcomeEmail = (userEmail: string, userName?: string) => {
    if (!user) return;
    
    queueEmailMutation.mutate({
      userId: user.id,
      templateKey: 'welcome_email',
      recipientEmail: userEmail,
      variables: {
        user_name: userName || 'Valued Customer',
      },
    });
  };

  const sendOrderConfirmation = (orderData: any) => {
    if (!user) return;
    
    queueEmailMutation.mutate({
      userId: user.id,
      templateKey: 'order_confirmation',
      recipientEmail: orderData.email,
      variables: {
        order_id: orderData.id,
        total_amount: orderData.total_amount,
        order_date: orderData.created_at,
      },
    });
  };

  const sendOrderStatusUpdate = (orderData: any) => {
    if (!user) return;
    
    queueEmailMutation.mutate({
      userId: user.id,
      templateKey: 'order_status_update',
      recipientEmail: orderData.email,
      variables: {
        order_id: orderData.id,
        new_status: orderData.status,
        updated_date: orderData.updated_at,
      },
    });
  };

  return {
    templates,
    templatesLoading,
    queueEmail: queueEmailMutation.mutate,
    processEmails: processEmailsMutation.mutate,
    sendWelcomeEmail,
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    isQueueing: queueEmailMutation.isPending,
    isProcessing: processEmailsMutation.isPending,
  };
};
