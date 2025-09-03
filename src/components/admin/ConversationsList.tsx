import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, RefreshCw, MessageSquare, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MessageThread from './MessageThread';

interface Conversation {
  id: string;
  phone_number: string;
  user_name?: string;
  status: string;
  last_message_at: string;
  created_at: string;
  metadata: any;
}

interface ConversationsListProps {
  onRefresh?: () => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ onRefresh }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to fetch conversations');
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while fetching conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.phone_number.includes(searchTerm) ||
    (conv.user_name && conv.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const updateConversationStatus = async (conversationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_conversations')
        .update({ status: newStatus })
        .eq('id', conversationId);

      if (error) {
        toast.error('Failed to update conversation status');
        return;
      }

      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, status: newStatus }
            : conv
        )
      );

      toast.success(`Conversation ${newStatus}`);
      onRefresh?.();
    } catch (error) {
      console.error('Error updating conversation:', error);
      toast.error('An error occurred');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'resolved': return 'secondary';
      case 'blocked': return 'destructive';
      default: return 'outline';
    }
  };

  const handleViewChat = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMessageDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading conversations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Refresh */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by phone number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={fetchConversations} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversations ({filteredConversations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {conversation.user_name || conversation.phone_number}
                      </span>
                      <Badge variant={getStatusBadgeVariant(conversation.status)}>
                        {conversation.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Last message: {new Date(conversation.last_message_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {conversation.phone_number}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewChat(conversation)}
                    >
                      View Chat
                    </Button>
                    {conversation.status === 'active' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateConversationStatus(conversation.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Thread Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedConversation?.user_name || selectedConversation?.phone_number}
            </DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <MessageThread
              conversation={selectedConversation}
              onConversationUpdate={() => {
                fetchConversations();
                onRefresh?.();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationsList;