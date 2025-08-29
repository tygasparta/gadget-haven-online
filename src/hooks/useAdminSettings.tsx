import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StoreInfo {
  name: string;
  description: string;
  contact_email: string;
  phone_number: string;
  address: string;
  whatsapp_number: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  order_notifications: boolean;
  stock_alerts: boolean;
  low_stock_threshold: number;
}

export interface SecuritySettings {
  two_factor_auth: boolean;
  session_timeout_hours: number;
  require_strong_passwords: boolean;
}

export interface SystemSettings {
  auto_backup: boolean;
  backup_frequency: string;
  maintenance_mode: boolean;
}

export const useAdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: '',
    description: '',
    contact_email: '',
    phone_number: '',
    address: '',
    whatsapp_number: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    order_notifications: true,
    stock_alerts: true,
    low_stock_threshold: 10
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    two_factor_auth: false,
    session_timeout_hours: 24,
    require_strong_passwords: true
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    auto_backup: true,
    backup_frequency: 'daily',
    maintenance_mode: false
  });

  // Fetch settings from database
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('key, value');

      if (error) throw error;

      data?.forEach((setting) => {
        switch (setting.key) {
          case 'store_info':
            setStoreInfo(setting.value as unknown as StoreInfo);
            break;
          case 'notification_settings':
            setNotificationSettings(setting.value as unknown as NotificationSettings);
            break;
          case 'security_settings':
            setSecuritySettings(setting.value as unknown as SecuritySettings);
            break;
          case 'system_settings':
            setSystemSettings(setting.value as unknown as SystemSettings);
            break;
        }
      });
    } catch (error: any) {
      toast({
        title: "Error loading settings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save specific setting category
  const saveSetting = async (key: string, value: any) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ 
          key, 
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: `${key.replace('_', ' ')} settings have been updated successfully.`
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Individual save functions
  const saveStoreInfo = () => saveSetting('store_info', storeInfo);
  const saveNotificationSettings = () => saveSetting('notification_settings', notificationSettings);
  const saveSecuritySettings = () => saveSetting('security_settings', securitySettings);
  const saveSystemSettings = () => saveSetting('system_settings', systemSettings);

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    loading,
    saving,
    storeInfo,
    setStoreInfo,
    notificationSettings,
    setNotificationSettings,
    securitySettings,
    setSecuritySettings,
    systemSettings,
    setSystemSettings,
    saveStoreInfo,
    saveNotificationSettings,
    saveSecuritySettings,
    saveSystemSettings,
    refetch: fetchSettings
  };
};