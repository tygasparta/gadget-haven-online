
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bell, Mail, Smartphone, ShoppingCart, Star, Zap } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';
import { useToast } from '@/hooks/use-toast';
import EmailPreferencesSection from '@/components/EmailPreferencesSection';

const Notifications = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newArrivals: true,
    priceDrops: true,
    reviews: false,
    newsletter: true
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved."
    });
  };

  const notificationCategories = [
    {
      title: 'Communication Preferences',
      icon: <Bell className="w-5 h-5" />,
      settings: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          icon: <Mail className="w-4 h-4" />
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications on your device',
          icon: <Smartphone className="w-4 h-4" />
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive important updates via SMS',
          icon: <Smartphone className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Order & Account Updates',
      icon: <ShoppingCart className="w-5 h-5" />,
      settings: [
        {
          key: 'orderUpdates',
          label: 'Order Updates',
          description: 'Get notified about order status changes',
          icon: <ShoppingCart className="w-4 h-4" />
        },
        {
          key: 'reviews',
          label: 'Review Reminders',
          description: 'Reminders to review your purchases',
          icon: <Star className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Marketing & Promotions',
      icon: <Zap className="w-5 h-5" />,
      settings: [
        {
          key: 'promotions',
          label: 'Promotions & Deals',
          description: 'Special offers and discount notifications',
          icon: <Zap className="w-4 h-4" />
        },
        {
          key: 'newArrivals',
          label: 'New Arrivals',
          description: 'Be the first to know about new products',
          icon: <Star className="w-4 h-4" />
        },
        {
          key: 'priceDrops',
          label: 'Price Drops',
          description: 'Get alerted when prices drop on saved items',
          icon: <Zap className="w-4 h-4" />
        },
        {
          key: 'newsletter',
          label: 'Newsletter',
          description: 'Monthly newsletter with tips and updates',
          icon: <Mail className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-4xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-600">Manage how you receive notifications</p>
          </div>
        </div>

        {/* Tabs for different notification types */}
        <Tabs defaultValue="push" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="push">Push Notifications</TabsTrigger>
            <TabsTrigger value="email">Email Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="push" className="space-y-6">
            {/* Push Notification Categories */}
            {notificationCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {category.icon}
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-2">
                      <div className="flex items-start space-x-3">
                        <div className="text-gray-500 mt-1">
                          {setting.icon}
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={setting.key} className="text-sm font-medium text-gray-900">
                            {setting.label}
                          </Label>
                          <p className="text-xs text-gray-600 mt-1">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id={setting.key}
                        checked={settings[setting.key as keyof typeof settings]}
                        onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const newSettings = { ...settings };
                      Object.keys(newSettings).forEach(key => {
                        newSettings[key as keyof typeof settings] = false;
                      });
                      setSettings(newSettings);
                      toast({
                        title: "All Notifications Disabled",
                        description: "You can re-enable them individually anytime."
                      });
                    }}
                  >
                    Disable All
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const newSettings = { ...settings };
                      Object.keys(newSettings).forEach(key => {
                        newSettings[key as keyof typeof settings] = true;
                      });
                      setSettings(newSettings);
                      toast({
                        title: "All Notifications Enabled",
                        description: "You'll receive all types of notifications."
                      });
                    }}
                  >
                    Enable All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-6">
            <EmailPreferencesSection />
          </TabsContent>
        </Tabs>
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default Notifications;
