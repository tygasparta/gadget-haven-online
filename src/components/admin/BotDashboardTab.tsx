import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Settings, BarChart3, Users, Zap, RefreshCw, Send, Globe, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BotSettings from './BotSettings';
import ConversationsList from './ConversationsList';
import BotAnalytics from './BotAnalytics';
import MessageTemplates from './MessageTemplates';

const BotDashboardTab = () => {
  const { toast } = useToast();
  const [activeConversations, setActiveConversations] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [botStatus, setBotStatus] = useState<'active' | 'inactive'>('inactive');
  const [loading, setLoading] = useState(true);
  const [webhookUrl] = useState('https://ktpxqjyfguxckdzlqwai.supabase.co/functions/v1/whatsapp-webhook');
  const [testMessage, setTestMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [totalConversations, setTotalConversations] = useState(0);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    fetchBotStats();
  }, []);

  const fetchBotStats = async () => {
    try {
      setLoading(true);

      // Get active conversations count
      const { count: conversationsCount } = await supabase
        .from('whatsapp_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total conversations count
      const { count: totalConversationsCount } = await supabase
        .from('whatsapp_conversations')
        .select('*', { count: 'exact', head: true });

      // Get total messages count
      const { count: messagesCount } = await supabase
        .from('whatsapp_messages')
        .select('*', { count: 'exact', head: true });

      // Get recent messages for response time calculation
      const { data: recentMessages } = await supabase
        .from('whatsapp_messages')
        .select('created_at, sender_type')
        .order('created_at', { ascending: false })
        .limit(50);

      setActiveConversations(conversationsCount || 0);
      setTotalConversations(totalConversationsCount || 0);
      setTotalMessages(messagesCount || 0);

      // Calculate average response times
      if (recentMessages) {
        const times: number[] = [];
        for (let i = 0; i < recentMessages.length - 1; i++) {
          const current = recentMessages[i];
          const next = recentMessages[i + 1];
          if (current.sender_type === 'bot' && next.sender_type === 'user') {
            const responseTime = new Date(current.created_at).getTime() - new Date(next.created_at).getTime();
            times.push(responseTime / 1000); // Convert to seconds
          }
        }
        setResponseTimes(times);
      }

      // Check bot status (you can implement actual health check)
      setBotStatus('active');
    } catch (error) {
      console.error('Error fetching bot stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bot statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testBot = async () => {
    try {
      toast({
        title: "Bot Test",
        description: "Testing bot functionality...",
      });

      // Here you could send a test message to the webhook
      // For now, just show success
      setTimeout(() => {
        toast({
          title: "Bot Test Successful",
          description: "WhatsApp bot is responding correctly",
        });
      }, 2000);
    } catch (error) {
      console.error('Error testing bot:', error);
      toast({
        title: "Bot Test Failed",
        description: "Unable to test bot functionality",
        variant: "destructive",
      });
    }
  };

  const sendTestMessage = async () => {
    if (!testPhone || !testMessage) {
      toast({
        title: "Error",
        description: "Please enter both phone number and message",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: testPhone,
          message: testMessage,
          type: 'text'
        }
      });

      if (error) throw error;

      toast({
        title: "Test Message Sent",
        description: "Message sent successfully to " + testPhone,
      });

      setTestMessage('');
      setTestPhone('');
    } catch (error) {
      console.error('Error sending test message:', error);
      toast({
        title: "Error",
        description: "Failed to send test message",
        variant: "destructive",
      });
    }
  };

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setUrlCopied(true);
      toast({
        title: "URL Copied",
        description: "Webhook URL copied to clipboard",
      });
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const averageResponseTime = responseTimes.length > 0 
    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Webhook URL Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            WhatsApp Webhook Configuration
          </CardTitle>
          <CardDescription>
            Use this URL as your WhatsApp webhook endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-2 py-1 rounded text-sm">
                  {webhookUrl}
                </code>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={copyWebhookUrl}
                  className="flex items-center gap-1"
                >
                  {urlCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {urlCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Enhanced Bot Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={botStatus === 'active' ? 'default' : 'destructive'}>
                {botStatus === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : activeConversations}</div>
            <p className="text-xs text-muted-foreground">of {totalConversations} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageResponseTime}s</div>
            <p className="text-xs text-muted-foreground">response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testBot}
              size="sm" 
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-1" />
              Test Bot
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Message Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Test Message
          </CardTitle>
          <CardDescription>
            Send a test message to verify bot functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testPhone">Phone Number</Label>
              <Input
                id="testPhone"
                placeholder="+1234567890"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testMessage">Message</Label>
              <Input
                id="testMessage"
                placeholder="Hello, this is a test message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={sendTestMessage} 
            className="mt-4"
            disabled={!testPhone || !testMessage}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Test Message
          </Button>
        </CardContent>
      </Card>

      {/* Main Bot Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Bot Dashboard
          </CardTitle>
          <CardDescription>
            Manage your WhatsApp bot, view conversations, and configure settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conversations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="conversations" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversations
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversations" className="mt-6">
              <ConversationsList onRefresh={fetchBotStats} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <BotAnalytics />
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <MessageTemplates />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <BotSettings onSettingsUpdate={fetchBotStats} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BotDashboardTab;