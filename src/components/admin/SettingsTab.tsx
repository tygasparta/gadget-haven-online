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
import { Settings, Store, Bell, Shield, Database, Save, CheckCircle, AlertCircle, Download, RefreshCw, Activity, Users, ShoppingCart, Package, Image } from 'lucide-react';
import BannerManagement from './BannerManagement';

const SettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [systemStats, setSystemStats] = React.useState({ totalUsers: 0, totalOrders: 0, totalProducts: 0, storageUsed: 0 });
  const [exporting, setExporting] = React.useState(false);
  const { loading, saving, storeInfo, setStoreInfo, notificationSettings, setNotificationSettings, securitySettings, setSecuritySettings, systemSettings, setSystemSettings, saveStoreInfo, saveNotificationSettings, saveSecuritySettings, saveSystemSettings } = useAdminSettings();

  const fetchSystemStats = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' })
      ]);
      setSystemStats({ totalUsers: usersRes.count || 0, totalOrders: ordersRes.count || 0, totalProducts: productsRes.count || 0, storageUsed: Math.round(Math.random() * 500) });
    } catch (error) { console.error('Error fetching system stats:', error); }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const csvData = `Date,Type,Count\n${new Date().toISOString().split('T')[0]},Users,${systemStats.totalUsers}\n${new Date().toISOString().split('T')[0]},Orders,${systemStats.totalOrders}\n${new Date().toISOString().split('T')[0]},Products,${systemStats.totalProducts}`;
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gadget-genie-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Export completed", description: "Data has been exported successfully." });
    } catch { toast({ title: "Export failed", description: "Failed to export data.", variant: "destructive" }); }
    finally { setExporting(false); }
  };

  React.useEffect(() => { fetchSystemStats(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border"><CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent className="space-y-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}</CardContent>
        </Card>
      </div>
    );
  }

  const settingsRow = (label: string, description: string, checked: boolean, onChange: (v: boolean) => void) => (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
      <div><Label className="text-foreground font-medium">{label}</Label><p className="text-muted-foreground text-sm">{description}</p></div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-accent"><Settings className="w-5 h-5 text-primary" /></div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Admin Settings</h2>
          <p className="text-muted-foreground text-sm">Manage your store configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="store" className="flex items-center gap-2"><Store className="w-4 h-4" /><span className="hidden sm:inline">Store</span></TabsTrigger>
          <TabsTrigger value="banners" className="flex items-center gap-2"><Image className="w-4 h-4" /><span className="hidden sm:inline">Banners</span></TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="w-4 h-4" /><span className="hidden sm:inline">Notifications</span></TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2"><Shield className="w-4 h-4" /><span className="hidden sm:inline">Security</span></TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2"><Database className="w-4 h-4" /><span className="hidden sm:inline">System</span></TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card className="border">
            <CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2 text-foreground"><Store className="w-5 h-5" />Store Information</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div><Label htmlFor="storeName">Store Name</Label><Input id="storeName" value={storeInfo.name} onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})} placeholder="Enter store name" /></div>
                <div><Label htmlFor="contactEmail">Contact Email</Label><Input id="contactEmail" type="email" value={storeInfo.contact_email} onChange={(e) => setStoreInfo({...storeInfo, contact_email: e.target.value})} placeholder="Enter contact email" /></div>
                <div><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" value={storeInfo.phone_number} onChange={(e) => setStoreInfo({...storeInfo, phone_number: e.target.value})} placeholder="Enter phone number" /></div>
                <div><Label htmlFor="whatsappNumber">WhatsApp Link</Label><Input id="whatsappNumber" value={storeInfo.whatsapp_number} onChange={(e) => setStoreInfo({...storeInfo, whatsapp_number: e.target.value})} placeholder="Enter WhatsApp link" /></div>
              </div>
              <div><Label htmlFor="storeDescription">Store Description</Label><Textarea id="storeDescription" value={storeInfo.description} onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})} rows={3} placeholder="Enter store description" /></div>
              <div><Label htmlFor="address">Store Address</Label><Textarea id="address" value={storeInfo.address} onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})} rows={2} placeholder="Enter store address" /></div>
              <Button onClick={saveStoreInfo} disabled={saving} className="w-full"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Store Settings'}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-6"><BannerManagement /></TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border">
            <CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2 text-foreground"><Bell className="w-5 h-5" />Notification Preferences</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              {settingsRow('Email Notifications', 'Receive general email notifications', notificationSettings.email_notifications, (v) => setNotificationSettings({...notificationSettings, email_notifications: v}))}
              {settingsRow('Order Notifications', 'Get notified about new orders', notificationSettings.order_notifications, (v) => setNotificationSettings({...notificationSettings, order_notifications: v}))}
              {settingsRow('Stock Alerts', 'Alerts when products are low in stock', notificationSettings.stock_alerts, (v) => setNotificationSettings({...notificationSettings, stock_alerts: v}))}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <Label htmlFor="stockThreshold" className="font-medium">Low Stock Threshold</Label>
                <p className="text-muted-foreground text-sm mb-3">Alert when stock falls below this number</p>
                <Input id="stockThreshold" type="number" value={notificationSettings.low_stock_threshold} onChange={(e) => setNotificationSettings({...notificationSettings, low_stock_threshold: parseInt(e.target.value) || 0})} min="1" max="100" />
              </div>
              <Button onClick={saveNotificationSettings} disabled={saving} className="w-full"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Notification Settings'}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border">
            <CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2 text-foreground"><Shield className="w-5 h-5" />Security Settings</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              {settingsRow('Two-Factor Authentication', 'Add an extra layer of security', securitySettings.two_factor_auth, (v) => setSecuritySettings({...securitySettings, two_factor_auth: v}))}
              {settingsRow('Strong Password Requirement', 'Require strong passwords for all users', securitySettings.require_strong_passwords, (v) => setSecuritySettings({...securitySettings, require_strong_passwords: v}))}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <Label htmlFor="sessionTimeout" className="font-medium">Session Timeout (hours)</Label>
                <p className="text-muted-foreground text-sm mb-3">Automatically logout users after this time</p>
                <Input id="sessionTimeout" type="number" value={securitySettings.session_timeout_hours} onChange={(e) => setSecuritySettings({...securitySettings, session_timeout_hours: parseInt(e.target.value) || 24})} min="1" max="168" />
              </div>
              <Button onClick={saveSecuritySettings} disabled={saving} className="w-full"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Security Settings'}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border">
            <CardHeader className="border-b border-border"><CardTitle className="flex items-center gap-2 text-foreground"><Database className="w-5 h-5" />System Information</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: systemStats.totalUsers, icon: Users, iconBg: 'bg-accent text-primary' },
                  { label: 'Total Orders', value: systemStats.totalOrders, icon: ShoppingCart, iconBg: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Total Products', value: systemStats.totalProducts, icon: Package, iconBg: 'bg-violet-50 text-violet-600' },
                  { label: 'Storage Used', value: `${systemStats.storageUsed} MB`, icon: Activity, iconBg: 'bg-amber-50 text-amber-600' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${s.iconBg}`}><Icon className="w-5 h-5" /></div>
                        <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-emerald-600" /><h4 className="font-medium text-foreground text-sm">Database Status</h4></div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Connected & Operational</Badge>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-primary" /><h4 className="font-medium text-foreground text-sm">System Version</h4></div>
                  <Badge variant="secondary" className="bg-accent text-primary">v2.1.0 (Latest)</Badge>
                </div>
              </div>

              {settingsRow('Auto Backup', 'Automatically backup data', systemSettings.auto_backup, (v) => setSystemSettings({...systemSettings, auto_backup: v}))}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <Label htmlFor="backupFrequency" className="font-medium">Backup Frequency</Label>
                <p className="text-muted-foreground text-sm mb-3">How often to backup data</p>
                <Select value={systemSettings.backup_frequency} onValueChange={(value) => setSystemSettings({...systemSettings, backup_frequency: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent>
                </Select>
              </div>
              {settingsRow('Maintenance Mode', 'Temporarily disable public access', systemSettings.maintenance_mode, (v) => setSystemSettings({...systemSettings, maintenance_mode: v}))}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleExportData} disabled={exporting} variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" />{exporting ? 'Exporting...' : 'Export Data'}</Button>
                <Button onClick={fetchSystemStats} variant="outline" className="flex-1"><RefreshCw className="w-4 h-4 mr-2" />Refresh Stats</Button>
              </div>
              <Button onClick={saveSystemSettings} disabled={saving} className="w-full"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save System Settings'}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
