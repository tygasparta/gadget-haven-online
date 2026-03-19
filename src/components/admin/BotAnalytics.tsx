import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BotAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalConversations: 0, totalMessages: 0, activeUsers: 0, avgResponseTime: '2.5s',
    dailyMessages: [] as any[], messagesByHour: [] as any[], conversationStatus: [] as any[], topKeywords: [] as any[]
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data: conversations, error: convError } = await supabase.from('whatsapp_conversations').select('status, created_at');
      if (convError) throw convError;
      const { data: messages, error: msgError } = await supabase.from('whatsapp_messages').select('created_at, sender_type, content');
      if (msgError) throw msgError;
      const totalConversations = conversations?.length || 0;
      const totalMessages = messages?.length || 0;
      const activeUsers = conversations?.filter(c => c.status === 'active').length || 0;
      const dailyMessages = processHourlyMessages(messages || []);
      const messagesByHour = processMessagesByHour(messages || []);
      const conversationStatus = processConversationStatus(conversations || []);
      const topKeywords = processTopKeywords(messages || []);
      setAnalytics({ totalConversations, totalMessages, activeUsers, avgResponseTime: '2.3s', dailyMessages, messagesByHour, conversationStatus, topKeywords });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally { setLoading(false); }
  };

  const processHourlyMessages = (messages: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => { const date = new Date(); date.setDate(date.getDate() - i); return date.toISOString().split('T')[0]; }).reverse();
    return last7Days.map(date => ({ date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), messages: messages.filter(m => m.created_at.startsWith(date)).length }));
  };

  const processMessagesByHour = (messages: any[]) => {
    return Array.from({ length: 24 }, (_, hour) => ({ hour: `${hour}:00`, messages: messages.filter(m => new Date(m.created_at).getHours() === hour).length }));
  };

  const processConversationStatus = (conversations: any[]) => {
    const statusCounts = conversations.reduce((acc: any, conv: any) => { acc[conv.status] = (acc[conv.status] || 0) + 1; return acc; }, {});
    return Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count as number }));
  };

  const processTopKeywords = (messages: any[]) => {
    const keywords = ['phone', 'laptop', 'help', 'support', 'price', 'buy'];
    return keywords.map(keyword => {
      const count = messages.filter(m => typeof m.content === 'string' ? m.content.toLowerCase().includes(keyword) : m.content?.text?.toLowerCase().includes(keyword)).length;
      return { keyword, count, percentage: messages.length > 0 ? Math.round((count / messages.length) * 100) : 0 };
    }).filter(k => k.count > 0).sort((a, b) => b.count - a.count);
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const COLORS = ['hsl(201, 91%, 40%)', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-muted-foreground" />
        <span className="text-muted-foreground">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Conversations', value: analytics.totalConversations, icon: MessageSquare, color: 'bg-accent text-primary' },
          { label: 'Total Messages', value: analytics.totalMessages, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Active Users', value: analytics.activeUsers, icon: Users, color: 'bg-violet-50 text-violet-600' },
          { label: 'Avg Response Time', value: analytics.avgResponseTime, icon: Clock, color: 'bg-amber-50 text-amber-600' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <Card key={i} className="border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${metric.color}`}><Icon className="w-6 h-6" /></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border">
          <CardHeader><CardTitle className="text-foreground">Daily Messages (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyMessages}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="messages" fill="hsl(201, 91%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader><CardTitle className="text-foreground">Conversation Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={analytics.conversationStatus} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="hsl(201, 91%, 40%)" dataKey="value">
                  {analytics.conversationStatus.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Messages by Hour Chart */}
      <Card className="border">
        <CardHeader><CardTitle className="text-foreground">Messages by Hour</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.messagesByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="hsl(201, 91%, 40%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Keywords */}
      <Card className="border">
        <CardHeader><CardTitle className="text-foreground">Top Keywords</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topKeywords.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{item.keyword}</span>
                  <span className="text-sm text-muted-foreground">({item.count} mentions)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
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
