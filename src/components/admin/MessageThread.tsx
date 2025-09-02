import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_type: 'user' | 'bot';
  message_type: string;
  content: any;
  created_at: string;
  delivered: boolean;
  read: boolean;
}

interface Conversation {
  id: string;
  phone_number: string;
  user_name: string;
  status: string;
}

interface MessageThreadProps {
  conversation: Conversation;
  onConversationUpdate?: () => void;
}

const MessageThread = ({ conversation, onConversationUpdate }: MessageThreadProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [conversation.id]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);

      // Add message to database
      const { data: messageData, error: messageError } = await supabase
        .from('whatsapp_messages')
        .insert({
          conversation_id: conversation.id,
          sender_type: 'bot',
          message_type: 'text',
          content: { text: newMessage.trim() },
          delivered: false,
          read: false
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Send message via WhatsApp API
      const { error: sendError } = await supabase.functions.invoke('whatsapp-send', {
        body: {
          phone: conversation.phone_number,
          message: newMessage.trim()
        }
      });

      if (sendError) {
        console.error('Error sending WhatsApp message:', sendError);
        // Still add to local state even if sending fails
      }

      // Add to local state
      setMessages([...messages, messageData as Message]);
      setNewMessage('');

      // Update conversation last message time
      await supabase
        .from('whatsapp_conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', conversation.id);

      onConversationUpdate?.();

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
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

      fetchMessages();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.content?.text) {
      return <p className="text-sm">{message.content.text}</p>;
    }
    
    if (message.content?.buttons) {
      return (
        <div className="space-y-2">
          {message.content.text && <p className="text-sm">{message.content.text}</p>}
          <div className="flex flex-wrap gap-2">
            {message.content.buttons.map((button: any, index: number) => (
              <Badge key={index} variant="outline">
                {button.title}
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-sm text-muted-foreground">Unsupported message type</p>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Conversation Info */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{conversation.user_name}</h3>
            <p className="text-sm text-muted-foreground">{conversation.phone_number}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={markAsRead} variant="outline" size="sm">
            Mark as Read
          </Button>
          <Button onClick={fetchMessages} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_type === 'user' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_type === 'user'
                      ? 'bg-muted text-left'
                      : 'bg-primary text-primary-foreground text-right'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender_type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.sender_type === 'user' ? 'Customer' : 'Bot'}
                    </span>
                  </div>
                  {renderMessageContent(message)}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {format(new Date(message.created_at), 'MMM d, HH:mm')}
                    </span>
                    {message.sender_type === 'bot' && (
                      <div className="flex space-x-1">
                        {message.delivered && (
                          <Badge variant="secondary" className="text-xs">
                            Delivered
                          </Badge>
                        )}
                        {message.read && (
                          <Badge variant="secondary" className="text-xs">
                            Read
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Send Message */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || sending}
            className="self-end"
          >
            {sending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;