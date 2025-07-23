
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Bell, Truck, Tag, Newspaper } from 'lucide-react';
import { useEmailPreferences, useUpdateEmailPreferences } from '@/hooks/useEmailPreferences';

const EmailPreferencesSection = () => {
  const { data: preferences, isLoading } = useEmailPreferences();
  const updatePreferences = useUpdateEmailPreferences();

  const handleToggle = (key: string, value: boolean) => {
    if (preferences) {
      updatePreferences.mutate({
        ...preferences,
        [key]: value,
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Loading your email preferences...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Unable to load email preferences</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const preferenceItems = [
    {
      key: 'order_confirmations',
      label: 'Order Confirmations',
      description: 'Get notified when your orders are confirmed',
      icon: <Mail className="w-4 h-4" />,
      value: preferences.order_confirmations,
    },
    {
      key: 'order_status_updates',
      label: 'Order Status Updates',
      description: 'Receive updates when your order status changes',
      icon: <Bell className="w-4 h-4" />,
      value: preferences.order_status_updates,
    },
    {
      key: 'shipping_notifications',
      label: 'Shipping Notifications',
      description: 'Get notified about shipping updates',
      icon: <Truck className="w-4 h-4" />,
      value: preferences.shipping_notifications,
    },
    {
      key: 'promotional_emails',
      label: 'Promotional Emails',
      description: 'Receive information about deals and offers',
      icon: <Tag className="w-4 h-4" />,
      value: preferences.promotional_emails,
    },
    {
      key: 'newsletter',
      label: 'Newsletter',
      description: 'Get our weekly newsletter with updates and tips',
      icon: <Newspaper className="w-4 h-4" />,
      value: preferences.newsletter,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
          Manage which email notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferenceItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="text-gray-500 mt-1">
                {item.icon}
              </div>
              <div className="flex-1">
                <Label htmlFor={item.key} className="text-sm font-medium text-gray-900">
                  {item.label}
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
            <Switch
              id={item.key}
              checked={item.value}
              onCheckedChange={(checked) => handleToggle(item.key, checked)}
              disabled={updatePreferences.isPending}
            />
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                const allOff = {
                  ...preferences,
                  order_confirmations: false,
                  order_status_updates: false,
                  shipping_notifications: false,
                  promotional_emails: false,
                  newsletter: false,
                };
                updatePreferences.mutate(allOff);
              }}
              disabled={updatePreferences.isPending}
            >
              Disable All
            </Button>
            <Button
              onClick={() => {
                const allOn = {
                  ...preferences,
                  order_confirmations: true,
                  order_status_updates: true,
                  shipping_notifications: true,
                  promotional_emails: true,
                  newsletter: true,
                };
                updatePreferences.mutate(allOn);
              }}
              disabled={updatePreferences.isPending}
            >
              Enable All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreferencesSection;
