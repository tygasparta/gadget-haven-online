import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StoreSettings {
  name: string;
  description: string;
  contact_email: string;
  phone_number: string;
  address: string;
  whatsapp_number: string;
}

export const useStoreSettings = () => {
  const [loading, setLoading] = useState(true);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Gadget Genie',
    description: 'Your Ultimate Tech Destination',
    contact_email: 'info@gadgetgenie.org',
    phone_number: '+263 71 933 7910',
    address: '',
    whatsapp_number: 'https://wa.me/263719337910'
  });

  const fetchStoreSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'store_info')
        .single();

      if (error) {
        console.error('Error fetching store settings:', error);
        return;
      }

      if (data?.value) {
        setStoreSettings(data.value as unknown as StoreSettings);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreSettings();
  }, []);

  return {
    loading,
    storeSettings,
    refetch: fetchStoreSettings
  };
};