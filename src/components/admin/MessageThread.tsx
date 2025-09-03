import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RefreshCw, User, Bot, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_type: string;
  content: any;
  created_at: string;
  delivered: boolean;
  read: boolean;
}

interface Conversation {
  id: string;
  phone_number: string;
  user_name?: string;
}

interface MessageThreadProps {
  conversation: Conversation;
  onConversationUpdate?: () => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ 
  conversation, 
  onConversationUpdate 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to fetch messages');
        return;
      }

      setMessages(data || []);
      
      // Mark user messages as read
      if (data && data.length > 0) {
        await markAsRead();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await supabase
        .from('whatsapp_messages')
        .update({ read: true })
        .eq('conversation_id', conversation.id)
        .eq('sender_type', 'user')
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);

      // First, save the message to database
      const { error: dbError } = await supabase
        .from('whatsapp_messages')
        .insert({
          conversation_id: conversation.id,
          sender_type: 'admin',
          message_type: 'text',
          content: { text: newMessage },
          delivered: false,
          read: false
        });

      if (dbError) {
        toast.error('Failed to save message');
        return;
      }

      // Then send via WhatsApp API
      const { data, error } = await supabase.functions.invoke('whatsapp-send', {
        body: {
          phone: conversation.phone_number,
          message: newMessage
        }
      });

      if (error) {
        toast.error('Failed to send message');
        return;
      }

      // Update conversation last message time
      await supabase
        .from('whatsapp_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id);

      toast.success('Message sent successfully!');
      setNewMessage('');
      fetchMessages();
      onConversationUpdate?.();

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred while sending the message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversation.id]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const renderMessageContent = (message: Message) => {
    const content = message.content;
    
    if (typeof content === 'string') {
      return content;
    }
    
    if (content.text) {
      return (
        <div>
          <p>{content.text}</p>
          {content.buttons && content.buttons.length > 0 && (
            <div className="mt-2 space-y-1">
              {content.buttons.map((button: any, index: number) => (
                <Badge key={index} variant="outline" className="mr-2">
                  {button.title}
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return JSON.stringify(content);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[60vh]">
      {/* Conversation Info */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <h3 className="font-medium">
              {conversation.user_name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500">{conversation.phone_number}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_type === 'user' 
                    ? 'justify-start' 
                    : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender_type === 'user'
                      ? 'bg-gray-100 text-gray-900'
                      : message.sender_type === 'bot'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-green-100 text-green-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender_type === 'user' ? (
                      <User className="w-3 h-3" />
                    ) : message.sender_type === 'bot' ? (
                      <Bot className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium capitalize">
                      {message.sender_type}
                    </span>
                    <Clock className="w-3 h-3" />
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    {renderMessageContent(message)}
                  </div>
                  {message.sender_type !== 'user' && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-400">
                        {message.delivered ? '✓✓' : '✓'} 
                        {message.delivered ? 'Delivered' : 'Sent'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={sending || !newMessage.trim()}
            className="self-end"
          >
            {sending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;