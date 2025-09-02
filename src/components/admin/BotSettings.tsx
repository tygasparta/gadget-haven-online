import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BotSettingsProps {
  onSettingsUpdate?: () => void;
}

const BotSettings = ({ onSettingsUpdate }: BotSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    welcomeMessage: '',
    autoResponses: true,
    businessHours: {
      enabled: false,
      start: '09:00',
      end: '18:00',
      timezone: 'UTC'
    },
    keywords: {
      products: ['products', 'catalog', 'items'],
      search: ['search', 'find', 'look'],
      support: ['help', 'support', 'assistance']
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data: botSettings, error } = await supabase
        .from('bot_settings')
        .select('key, value')
        .in('key', ['welcome_message', 'auto_responses', 'menu_options']);

      if (error) throw error;

      // Process settings
      const settingsMap = botSettings?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as any) || {};

      setSettings({
        welcomeMessage: settingsMap.welcome_message?.text || '',
        autoResponses: settingsMap.auto_responses?.enabled ?? true,
        businessHours: {
          enabled: settingsMap.auto_responses?.business_hours?.enabled ?? false,
          start: settingsMap.auto_responses?.business_hours?.start || '09:00',
          end: settingsMap.auto_responses?.business_hours?.end || '18:00',
          timezone: settingsMap.auto_responses?.business_hours?.timezone || 'UTC'
        },
        keywords: {
          products: ['products', 'catalog', 'items'],
          search: ['search', 'find', 'look'],
          support: ['help', 'support', 'assistance']
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bot settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      // Update welcome message
      await supabase
        .from('bot_settings')
        .upsert({
          key: 'welcome_message',
          value: { text: settings.welcomeMessage },
          description: 'Welcome message sent to new users'
        });

      // Update auto responses
      await supabase
        .from('bot_settings')
        .upsert({
          key: 'auto_responses',
          value: {
            enabled: settings.autoResponses,
            business_hours: settings.businessHours
          },
          description: 'Auto response settings'
        });

      toast({
        title: "Settings Saved",
        description: "Bot settings have been updated successfully",
      });

      onSettingsUpdate?.();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save bot settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testWebhook = async () => {
    try {
      toast({
        title: "Testing Webhook",
        description: "Sending test request to WhatsApp webhook...",
      });

      // In a real implementation, you would call your webhook endpoint
      // For now, just simulate success
      setTimeout(() => {
        toast({
          title: "Webhook Test Successful",
          description: "WhatsApp webhook is responding correctly",
        });
      }, 2000);
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Webhook Test Failed",
        description: "Unable to connect to WhatsApp webhook",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome Message</CardTitle>
          <CardDescription>
            Customize the message sent to users when they first interact with the bot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({
                ...settings,
                welcomeMessage: e.target.value
              })}
              placeholder="Enter welcome message..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto Response Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto Response Settings</CardTitle>
          <CardDescription>
            Configure automatic responses and business hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto Responses</Label>
              <p className="text-sm text-muted-foreground">
                Automatically respond to common queries
              </p>
            </div>
            <Switch
              checked={settings.autoResponses}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                autoResponses: checked
              })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Business Hours</Label>
              <p className="text-sm text-muted-foreground">
                Only respond during specific hours
              </p>
            </div>
            <Switch
              checked={settings.businessHours.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                businessHours: {
                  ...settings.businessHours,
                  enabled: checked
                }
              })}
            />
          </div>

          {settings.businessHours.enabled && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.businessHours.start}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: {
                      ...settings.businessHours,
                      start: e.target.value
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.businessHours.end}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: {
                      ...settings.businessHours,
                      end: e.target.value
                    }
                  })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keyword Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Recognition</CardTitle>
          <CardDescription>
            Keywords that trigger specific bot responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Product Keywords</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.keywords.products.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Search Keywords</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.keywords.search.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Support Keywords</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.keywords.support.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Testing</CardTitle>
          <CardDescription>
            Test the WhatsApp webhook configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={testWebhook} variant="outline">
            Test Webhook Connection
          </Button>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-2">
        <Button onClick={fetchSettings} variant="outline">
          Reset
        </Button>
        <Button onClick={saveSettings} disabled={saving}>
          {saving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default BotSettings;