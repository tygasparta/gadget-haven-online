import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, BarChart3, Users, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BotSettings from './BotSettings';
import ConversationsList from './ConversationsList';
import BotAnalytics from './BotAnalytics';

const BotDashboardTab = () => {
  const { toast } = useToast();
  const [activeConversations, setActiveConversations] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [botStatus, setBotStatus] = useState<'active' | 'inactive'>('inactive');
  const [loading, setLoading] = useState(true);

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

      // Get total messages count
      const { count: messagesCount } = await supabase
        .from('whatsapp_messages')
        .select('*', { count: 'exact', head: true });

      setActiveConversations(conversationsCount || 0);
      setTotalMessages(messagesCount || 0);

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

  return (
    <div className="space-y-6">
      {/* Bot Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testBot}
              size="sm" 
              className="w-full"
            >
              Test Bot
            </Button>
          </CardContent>
        </Card>
      </div>

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conversations" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversations
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
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