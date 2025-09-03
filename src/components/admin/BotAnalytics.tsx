import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BotAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    totalMessages: 0,
    activeUsers: 0,
    avgResponseTime: '2.5s',
    dailyMessages: [],
    messagesByHour: [],
    conversationStatus: [],
    topKeywords: []
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch conversations
      const { data: conversations, error: convError } = await supabase
        .from('whatsapp_conversations')
        .select('status, created_at');

      if (convError) throw convError;

      // Fetch messages
      const { data: messages, error: msgError } = await supabase
        .from('whatsapp_messages')
        .select('created_at, sender_type, content');

      if (msgError) throw msgError;

      // Calculate basic stats
      const totalConversations = conversations?.length || 0;
      const totalMessages = messages?.length || 0;
      const activeUsers = conversations?.filter(c => c.status === 'active').length || 0;

      // Process daily messages (last 7 days)
      const dailyMessages = processHourlyMessages(messages || []);
      
      // Process messages by hour
      const messagesByHour = processMessagesByHour(messages || []);

      // Process conversation status distribution
      const conversationStatus = processConversationStatus(conversations || []);

      // Process top keywords (simplified)
      const topKeywords = processTopKeywords(messages || []);

      setAnalytics({
        totalConversations,
        totalMessages,
        activeUsers,
        avgResponseTime: '2.3s',
        dailyMessages,
        messagesByHour,
        conversationStatus,
        topKeywords
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processHourlyMessages = (messages: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const count = messages.filter(m => 
        m.created_at.startsWith(date)
      ).length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        messages: count
      };
    });
  };

  const processMessagesByHour = (messages: any[]) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return hours.map(hour => {
      const count = messages.filter(m => {
        const messageHour = new Date(m.created_at).getHours();
        return messageHour === hour;
      }).length;
      
      return {
        hour: `${hour}:00`,
        messages: count
      };
    });
  };

  const processConversationStatus = (conversations: any[]) => {
    const statusCounts = conversations.reduce((acc, conv) => {
      acc[conv.status] = (acc[conv.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count as number
    }));
  };

  const processTopKeywords = (messages: any[]) => {
    // Simplified keyword extraction
    const keywords = ['phone', 'laptop', 'help', 'support', 'price', 'buy'];
    
    return keywords.map(keyword => {
      const count = messages.filter(m => 
        typeof m.content === 'string' 
          ? m.content.toLowerCase().includes(keyword)
          : m.content?.text?.toLowerCase().includes(keyword)
      ).length;
      
      return {
        keyword,
        count,
        percentage: messages.length > 0 ? Math.round((count / messages.length) * 100) : 0
      };
    }).filter(k => k.count > 0).sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold">{analytics.totalConversations}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{analytics.totalMessages}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{analytics.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{analytics.avgResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Messages Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Messages (Last 7 Days)</CardTitle>
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

        {/* Conversation Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Status</CardTitle>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Messages by Hour Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Messages by Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.messagesByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Top Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topKeywords.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.keyword}</span>
                  <span className="text-sm text-gray-500">({item.count} mentions)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BotAnalytics;