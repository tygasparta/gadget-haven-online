import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Users, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const BotAnalytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    totalMessages: 0,
    avgResponseTime: 0,
    activeUsers: 0,
    dailyMessages: [],
    messagesByHour: [],
    conversationStatus: [],
    topKeywords: []
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get total conversations
      const { count: totalConversations } = await supabase
        .from('whatsapp_conversations')
        .select('*', { count: 'exact', head: true });

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('whatsapp_messages')
        .select('*', { count: 'exact', head: true });

      // Get active users (conversations in last 7 days)
      const sevenDaysAgo = subDays(new Date(), 7);
      const { count: activeUsers } = await supabase
        .from('whatsapp_conversations')
        .select('*', { count: 'exact', head: true })
        .gte('last_message_at', sevenDaysAgo.toISOString());

      // Get daily messages for last 7 days
      const dailyMessagesData = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const startDate = startOfDay(date);
        const endDate = endOfDay(date);

        const { count } = await supabase
          .from('whatsapp_messages')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        dailyMessagesData.push({
          date: format(date, 'MMM dd'),
          messages: count || 0
        });
      }

      // Get messages by hour (last 24 hours)
      const messagesByHourData = [];
      for (let hour = 0; hour < 24; hour++) {
        const { count } = await supabase
          .from('whatsapp_messages')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', subDays(new Date(), 1).toISOString())
          .like('created_at', `%${hour.toString().padStart(2, '0')}:%`);

        messagesByHourData.push({
          hour: `${hour}:00`,
          messages: count || 0
        });
      }

      // Get conversation status distribution
      const { data: statusData } = await supabase
        .from('whatsapp_conversations')
        .select('status');

      const statusCounts = statusData?.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const conversationStatusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count
      }));

      setAnalytics({
        totalConversations: totalConversations || 0,
        totalMessages: totalMessages || 0,
        avgResponseTime: 2.5, // Mock data - you'd calculate this from actual response times
        activeUsers: activeUsers || 0,
        dailyMessages: dailyMessagesData,
        messagesByHour: messagesByHourData,
        conversationStatus: conversationStatusData,
        topKeywords: [
          { keyword: 'products', count: 45 },
          { keyword: 'price', count: 32 },
          { keyword: 'search', count: 28 },
          { keyword: 'help', count: 19 }
        ] // Mock data - you'd extract this from message content
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bot analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgResponseTime}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Messages (Last 7 Days)</CardTitle>
            <CardDescription>
              Message volume over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyMessages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Status</CardTitle>
            <CardDescription>
              Distribution of conversation statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.conversationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.conversationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Messages by Hour (24h)</CardTitle>
            <CardDescription>
              Message activity throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.messagesByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Keywords */}
        <Card>
          <CardHeader>
            <CardTitle>Top Keywords</CardTitle>
            <CardDescription>
              Most frequently used keywords by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topKeywords.map((item, index) => (
                <div key={item.keyword} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <span className="font-medium">{item.keyword}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.count / Math.max(...analytics.topKeywords.map(k => k.count))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BotAnalytics;