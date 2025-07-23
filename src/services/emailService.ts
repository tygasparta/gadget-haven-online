
import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplate {
  id: string;
  template_key: string;
  subject: string;
  html_content: string;
  text_content?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QueueEmailParams {
  userId: string;
  templateKey: string;
  recipientEmail: string;
  variables?: Record<string, any>;
}

export const emailService = {
  async queueEmail(params: QueueEmailParams) {
    try {
      const { data, error } = await supabase.functions.invoke('queue-email', {
        body: {
          user_id: params.userId,
          template_key: params.templateKey,
          recipient_email: params.recipientEmail,
          variables: params.variables || {},
        },
      });

      if (error) {
        console.error('Error queueing email:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Failed to queue email:', err);
      throw err;
    }
  },

  async processEmailQueue() {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {},
    });

    if (error) {
      console.error('Error processing email queue:', error);
      throw error;
    }

    return data;
  },

  async getEmailTemplates() {
    try {
      const { data, error } = await supabase.functions.invoke('get-email-templates', {
        body: {},
      });

      if (error) {
        console.error('Error fetching email templates:', error);
        throw error;
      }

      return data as EmailTemplate[];
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      throw err;
    }
  },

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>) {
    try {
      const { data, error } = await supabase.functions.invoke('update-email-template', {
        body: {
          id,
          updates,
        },
      });

      if (error) {
        console.error('Error updating email template:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Failed to update template:', err);
      throw err;
    }
  },

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase.functions.invoke('create-email-template', {
        body: template,
      });

      if (error) {
        console.error('Error creating email template:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Failed to create template:', err);
      throw err;
    }
  },
};
