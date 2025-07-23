
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
    const { data, error } = await supabase.rpc('queue_email_notification', {
      p_user_id: params.userId,
      p_template_key: params.templateKey,
      p_recipient_email: params.recipientEmail,
      p_variables: params.variables || {},
    });

    if (error) {
      console.error('Error queueing email:', error);
      throw error;
    }

    return data;
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
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('template_key');

    if (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }

    return data as EmailTemplate[];
  },

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>) {
    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email template:', error);
      throw error;
    }

    return data;
  },

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();

    if (error) {
      console.error('Error creating email template:', error);
      throw error;
    }

    return data;
  },
};
