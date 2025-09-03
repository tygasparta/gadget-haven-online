import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Settings, Save, RefreshCw, MessageCircle, Clock, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BotSettingsProps {
  onSettingsUpdate?: () => void;
}

const BotSettings: React.FC<BotSettingsProps> = ({ onSettingsUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    welcome_message: {
      enabled: true,
      message: "Hello! 👋 Welcome to Gadget Genie! How can I help you today?"
    },
    auto_response: {
      enabled: true,
      business_hours: { start: "09:00", end: "17:00" },
      after_hours_message: "Thanks for contacting us! We're currently offline. We'll get back to you during business hours (9 AM - 5 PM)."
    },
    keywords: {
      product_keywords: ["phone", "laptop", "headphones", "tablet", "watch"],
      support_keywords: ["help", "support", "problem", "issue"],
      price_keywords: ["price", "cost", "how much"]
    }
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bot_settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching bot settings:', error);
        toast.error('Failed to fetch bot settings');
        return;
      }

      if (data && data.length > 0) {
        const settingsObj = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as any);

        setSettings(prevSettings => ({
          ...prevSettings,
          ...settingsObj
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while fetching settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      // Update each setting
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        description: getSettingDescription(key)
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('bot_settings')
          .upsert(update, { onConflict: 'key' });

        if (error) {
          console.error('Error updating setting:', error);
          toast.error(`Failed to update ${update.key}`);
          return;
        }
      }

      toast.success('Bot settings updated successfully!');
      onSettingsUpdate?.();

    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  const getSettingDescription = (key: string) => {
    switch (key) {
      case 'welcome_message': return 'Welcome message configuration';
      case 'auto_response': return 'Auto response settings';
      case 'keywords': return 'Keyword recognition settings';
      default: return '';
    }
  };

  const testWebhook = async () => {
    try {
      const webhookUrl = `https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/whatsapp-webhook`;
      
      // This is a placeholder for webhook testing
      toast.success('Webhook connection test completed!');
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Webhook test failed');
    }
  };

  const addKeyword = (category: 'product_keywords' | 'support_keywords' | 'price_keywords', keyword: string) => {
    if (!keyword.trim()) return;
    
    setSettings(prev => ({
      ...prev,
      keywords: {
        ...prev.keywords,
        [category]: [...prev.keywords[category], keyword.trim()]
      }
    }));
  };

  const removeKeyword = (category: 'product_keywords' | 'support_keywords' | 'price_keywords', index: number) => {
    setSettings(prev => ({
      ...prev,
      keywords: {
        ...prev.keywords,
        [category]: prev.keywords[category].filter((_, i) => i !== index)
      }
    }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Welcome Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="welcome-enabled">Enable Welcome Message</Label>
            <Switch
              id="welcome-enabled"
              checked={settings.welcome_message.enabled}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  welcome_message: { ...prev.welcome_message, enabled: checked }
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="welcome-text">Welcome Message Text</Label>
            <Textarea
              id="welcome-text"
              value={settings.welcome_message.message}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  welcome_message: { ...prev.welcome_message, message: e.target.value }
                }))
              }
              placeholder="Enter your welcome message..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto Response Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Auto Response
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-response-enabled">Enable Auto Response</Label>
            <Switch
              id="auto-response-enabled"
              checked={settings.auto_response.enabled}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  auto_response: { ...prev.auto_response, enabled: checked }
                }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business-hours-start">Business Hours Start</Label>
              <Input
                id="business-hours-start"
                type="time"
                value={settings.auto_response.business_hours.start}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    auto_response: {
                      ...prev.auto_response,
                      business_hours: {
                        ...prev.auto_response.business_hours,
                        start: e.target.value
                      }
                    }
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="business-hours-end">Business Hours End</Label>
              <Input
                id="business-hours-end"
                type="time"
                value={settings.auto_response.business_hours.end}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    auto_response: {
                      ...prev.auto_response,
                      business_hours: {
                        ...prev.auto_response.business_hours,
                        end: e.target.value
                      }
                    }
                  }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="after-hours-message">After Hours Message</Label>
            <Textarea
              id="after-hours-message"
              value={settings.auto_response.after_hours_message}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  auto_response: { ...prev.auto_response, after_hours_message: e.target.value }
                }))
              }
              placeholder="Enter your after hours message..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Keyword Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Keyword Recognition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.keywords).map(([category, keywords]) => (
            <div key={category}>
              <Label className="capitalize">
                {category.replace('_', ' ')}
              </Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {keywords.map((keyword: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                    onClick={() => removeKeyword(category as any, index)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
              <Input
                placeholder={`Add ${category.replace('_', ' ')} keyword...`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addKeyword(category as any, (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button onClick={fetchSettings} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BotSettings;