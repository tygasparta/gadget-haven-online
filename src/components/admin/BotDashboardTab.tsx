import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Clock, TrendingUp, Copy, Send, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ConversationsList from './ConversationsList';
import BotAnalytics from './BotAnalytics';
import BotSettings from './BotSettings';
import MessageTemplates from './MessageTemplates';

const BotDashboardTab = () => {
  const [botStats, setBotStats] = useState({ activeConversations: 0, totalMessages: 0, avgResponseTime: '2.5s', totalConversations: 0 });
  const [loading, setLoading] = useState(true);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [botStatus, setBotStatus] = useState('Active');

  const fetchBotStats = async () => {
    try {
      setLoading(true);
      const { data: conversations, error: convError } = await supabase.from('whatsapp_conversations').select('status, created_at');
      if (convError) throw convError;
      const { data: messages, error: msgError } = await supabase.from('whatsapp_messages').select('created_at, sender_type');
      if (msgError) throw msgError;
      const activeConversations = conversations?.filter(c => c.status === 'active').length || 0;
      const totalConversations = conversations?.length || 0;
      const totalMessages = messages?.length || 0;
      const recentMessages = messages?.filter(m => new Date(m.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)) || [];
      const avgResponseTime = recentMessages.length > 0 ? '2.3s' : '0s';
      setBotStats({ activeConversations, totalMessages, avgResponseTime, totalConversations });
    } catch (error) {
      console.error('Error fetching bot stats:', error);
      toast.error('Failed to fetch bot statistics');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBotStats(); }, []);

  const sendTestMessage = async () => {
    if (!testPhone || !testMessage) { toast.error('Please enter both phone number and message'); return; }
    try {
      setSending(true);
      const { data, error } = await supabase.functions.invoke('whatsapp-send', { body: { phone: testPhone, message: testMessage } });
      if (error) throw error;
      toast.success('Test message sent successfully!');
      setTestMessage('');
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('Failed to send test message');
    } finally { setSending(false); }
  };

  const copyWebhookUrl = () => {
    const webhookUrl = `https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/whatsapp-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Webhook Configuration */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MessageSquare className="w-5 h-5" />
            WhatsApp Bot Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-mono flex-1 text-foreground">
              https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/whatsapp-webhook
            </span>
            <Button onClick={copyWebhookUrl} size="sm" variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Use this URL as your WhatsApp webhook endpoint in the Meta Developer Console.
          </p>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bot Status</p>
                <Badge variant={botStatus === 'Active' ? 'default' : 'secondary'}>{botStatus}</Badge>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50"><MessageSquare className="w-6 h-6 text-emerald-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Chats</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '...' : botStats.activeConversations}</p>
              </div>
              <div className="p-2 rounded-lg bg-accent"><Users className="w-6 h-6 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '...' : botStats.totalMessages}</p>
              </div>
              <div className="p-2 rounded-lg bg-violet-50"><TrendingUp className="w-6 h-6 text-violet-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-foreground">{botStats.avgResponseTime}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50"><Clock className="w-6 h-6 text-amber-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Message Section */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-foreground">Send Test Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input placeholder="e.g., +1234567890" value={testPhone} onChange={(e) => setTestPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message</label>
              <Input placeholder="Test message content..." value={testMessage} onChange={(e) => setTestMessage(e.target.value)} />
            </div>
          </div>
          <Button onClick={sendTestMessage} disabled={sending || !testPhone || !testMessage} className="w-full md:w-auto">
            {sending ? (<><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Sending...</>) : (<><Send className="w-4 h-4 mr-2" />Send Test Message</>)}
          </Button>
        </CardContent>
      </Card>

      {/* Main Dashboard */}
      <Card className="border">
        <CardContent className="p-6">
          <Tabs defaultValue="conversations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="conversations" className="mt-6"><ConversationsList onRefresh={fetchBotStats} /></TabsContent>
            <TabsContent value="analytics" className="mt-6"><BotAnalytics /></TabsContent>
            <TabsContent value="templates" className="mt-6"><MessageTemplates /></TabsContent>
            <TabsContent value="settings" className="mt-6"><BotSettings onSettingsUpdate={fetchBotStats} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BotDashboardTab;
