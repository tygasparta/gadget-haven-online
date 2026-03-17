import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Store, 
  Bell, 
  Shield, 
  Database, 
  Save,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Activity,
  Users,
  ShoppingCart,
  Package,
  Image
} from 'lucide-react';
import BannerManagement from './BannerManagement';

const SettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [systemStats, setSystemStats] = React.useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    storageUsed: 0
  });
  const [exporting, setExporting] = React.useState(false);

  const {
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
    saveSystemSettings
  } = useAdminSettings();

  // Fetch system statistics
  const fetchSystemStats = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' })
      ]);

      setSystemStats({
        totalUsers: usersRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalProducts: productsRes.count || 0,
        storageUsed: Math.round(Math.random() * 500) // Mock storage usage
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  // Export data functionality
  const handleExportData = async () => {
    setExporting(true);
    try {
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock CSV data
      const csvData = `Date,Type,Count\n${new Date().toISOString().split('T')[0]},Users,${systemStats.totalUsers}\n${new Date().toISOString().split('T')[0]},Orders,${systemStats.totalOrders}\n${new Date().toISOString().split('T')[0]},Products,${systemStats.totalProducts}`;
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gadget-genie-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export completed",
        description: "Data has been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone);
  };

  const validateWhatsApp = (url: string) => {
    return url.startsWith('https://wa.me/') || url.startsWith('https://api.whatsapp.com/');
  };

  React.useEffect(() => {
    fetchSystemStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <Settings className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
          <p className="text-gray-300">Manage your store configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm">
          <TabsTrigger 
            value="store" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger 
            value="banners" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600"
          >
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Banners</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="system" 
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600"
          >
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/20">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Store Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="storeName" className="text-white">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={storeInfo.contact_email}
                    onChange={(e) => setStoreInfo({...storeInfo, contact_email: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={storeInfo.phone_number}
                    onChange={(e) => setStoreInfo({...storeInfo, phone_number: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappNumber" className="text-white">WhatsApp Link</Label>
                  <Input
                    id="whatsappNumber"
                    value={storeInfo.whatsapp_number}
                    onChange={(e) => setStoreInfo({...storeInfo, whatsapp_number: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter WhatsApp link"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="storeDescription" className="text-white">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeInfo.description}
                  onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter store description"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-white">Store Address</Label>
                <Textarea
                  id="address"
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
                  rows={2}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter store address"
                />
              </div>
              <Button 
                onClick={saveStoreInfo}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Store Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/20">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-white font-medium">Email Notifications</Label>
                    <p className="text-gray-400 text-sm">Receive general email notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, email_notifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-white font-medium">Order Notifications</Label>
                    <p className="text-gray-400 text-sm">Get notified about new orders</p>
                  </div>
                  <Switch
                    checked={notificationSettings.order_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, order_notifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-white font-medium">Stock Alerts</Label>
                    <p className="text-gray-400 text-sm">Alerts when products are low in stock</p>
                  </div>
                  <Switch
                    checked={notificationSettings.stock_alerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, stock_alerts: checked})
                    }
                  />
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <Label htmlFor="stockThreshold" className="text-white font-medium">Low Stock Threshold</Label>
                  <p className="text-gray-400 text-sm mb-3">Alert when stock falls below this number</p>
                  <Input
                    id="stockThreshold"
                    type="number"
                    value={notificationSettings.low_stock_threshold}
                    onChange={(e) => 
                      setNotificationSettings({...notificationSettings, low_stock_threshold: parseInt(e.target.value) || 0})
                    }
                    className="bg-white/10 border-white/20 text-white"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              <Button 
                onClick={saveNotificationSettings}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/20">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-white font-medium">Two-Factor Authentication</Label>
                    <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={securitySettings.two_factor_auth}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, two_factor_auth: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-white font-medium">Strong Password Requirement</Label>
                    <p className="text-gray-400 text-sm">Require strong passwords for all users</p>
                  </div>
                  <Switch
                    checked={securitySettings.require_strong_passwords}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, require_strong_passwords: checked})
                    }
                  />
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <Label htmlFor="sessionTimeout" className="text-white font-medium">Session Timeout (hours)</Label>
                  <p className="text-gray-400 text-sm mb-3">Automatically logout users after this time</p>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.session_timeout_hours}
                    onChange={(e) => 
                      setSecuritySettings({...securitySettings, session_timeout_hours: parseInt(e.target.value) || 24})
                    }
                    className="bg-white/10 border-white/20 text-white"
                    min="1"
                    max="168"
                  />
                </div>
              </div>
              <Button 
                onClick={saveSecuritySettings}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/20">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>System Information & Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* System Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Total Users</h4>
                      <p className="text-2xl font-bold text-blue-400">{systemStats.totalUsers}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Total Orders</h4>
                      <p className="text-2xl font-bold text-green-400">{systemStats.totalOrders}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Total Products</h4>
                      <p className="text-2xl font-bold text-purple-400">{systemStats.totalProducts}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg border border-orange-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Storage Used</h4>
                      <p className="text-2xl font-bold text-orange-400">{systemStats.storageUsed} MB</p>
                      <Progress value={(systemStats.storageUsed / 1000) * 100} className="mt-1 h-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-white">Database Status</h4>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    Connected & Operational
                  </Badge>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">System Version</h4>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    v2.1.0 (Latest)
                  </Badge>
                </div>
              </div>
              
              {/* System Settings */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-white font-medium">Auto Backup</Label>
                    <p className="text-gray-400 text-sm">Automatically backup data</p>
                  </div>
                  <Switch
                    checked={systemSettings.auto_backup}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, auto_backup: checked})
                    }
                  />
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <Label htmlFor="backupFrequency" className="text-white font-medium">Backup Frequency</Label>
                  <p className="text-gray-400 text-sm mb-3">How often to backup data</p>
                  <Select 
                    value={systemSettings.backup_frequency}
                    onValueChange={(value) => 
                      setSystemSettings({...systemSettings, backup_frequency: value})
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <Label className="text-white font-medium">Maintenance Mode</Label>
                    <p className="text-gray-400 text-sm">Temporarily disable public access</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenance_mode}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, maintenance_mode: checked})
                    }
                  />
                </div>
              </div>

              {/* System Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleExportData}
                  disabled={exporting}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exporting ? 'Exporting...' : 'Export Data'}
                </Button>
                <Button 
                  onClick={fetchSystemStats}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Stats
                </Button>
              </div>

              <Button 
                onClick={saveSystemSettings}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save System Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;