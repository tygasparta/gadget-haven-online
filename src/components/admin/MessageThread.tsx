import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RefreshCw, User, Bot, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string; sender_type: string; content: any; created_at: string; delivered: boolean; read: boolean;
}

interface MessageThreadProps {
  conversation: { id: string; phone_number: string; user_name?: string; };
  onConversationUpdate?: () => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ conversation, onConversationUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('whatsapp_messages').select('*').eq('conversation_id', conversation.id).order('created_at', { ascending: true });
      if (error) { toast.error('Failed to fetch messages'); return; }
      setMessages(data || []);
      if (data && data.length > 0) await markAsRead();
    } catch (error) { toast.error('An error occurred while fetching messages'); }
    finally { setLoading(false); }
  };

  const markAsRead = async () => {
    try { await supabase.from('whatsapp_messages').update({ read: true }).eq('conversation_id', conversation.id).eq('sender_type', 'user').eq('read', false); }
    catch (error) { console.error('Error marking messages as read:', error); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      setSending(true);
      const { error: dbError } = await supabase.from('whatsapp_messages').insert({ conversation_id: conversation.id, sender_type: 'admin', message_type: 'text', content: { text: newMessage }, delivered: false, read: false });
      if (dbError) { toast.error('Failed to save message'); return; }
      const { error } = await supabase.functions.invoke('whatsapp-send', { body: { phone: conversation.phone_number, message: newMessage } });
      if (error) { toast.error('Failed to send message'); return; }
      await supabase.from('whatsapp_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversation.id);
      toast.success('Message sent successfully!');
      setNewMessage('');
      fetchMessages();
      onConversationUpdate?.();
    } catch (error) { toast.error('An error occurred while sending the message'); }
    finally { setSending(false); }
  };

  useEffect(() => { fetchMessages(); }, [conversation.id]);
  useEffect(() => { if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight; }, [messages]);

  const renderMessageContent = (message: Message) => {
    const content = message.content;
    if (typeof content === 'string') return content;
    if (content.text) return (
      <div>
        <p>{content.text}</p>
        {content.buttons && content.buttons.length > 0 && (
          <div className="mt-2 space-y-1">
            {content.buttons.map((button: any, index: number) => (<Badge key={index} variant="outline" className="mr-2">{button.title}</Badge>))}
          </div>
        )}
      </div>
    );
    return JSON.stringify(content);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-muted-foreground" />
        <span className="text-muted-foreground">Loading messages...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[60vh]">
      {/* Conversation Info */}
      <div className="p-4 border-b border-border bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium text-foreground">{conversation.user_name || 'Unknown User'}</h3>
            <p className="text-sm text-muted-foreground">{conversation.phone_number}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground"><p>No messages yet</p></div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender_type === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender_type === 'user' ? 'bg-muted text-foreground'
                    : message.sender_type === 'bot' ? 'bg-accent text-accent-foreground'
                    : 'bg-primary/10 text-foreground'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender_type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    <span className="text-xs font-medium capitalize">{message.sender_type}</span>
                    <Clock className="w-3 h-3" />
                    <span className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-sm">{renderMessageContent(message)}</div>
                  {message.sender_type !== 'user' && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">{message.delivered ? '✓✓ Delivered' : '✓ Sent'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex gap-2">
          <Textarea placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 min-h-[60px]"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
          <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="self-end">
            {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
