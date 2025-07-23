
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Send, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProcessEmails } from '@/hooks/useEmailPreferences';
import { useToast } from '@/hooks/use-toast';

const EmailManagementTab = () => {
  const { toast } = useToast();
  const processEmails = useProcessEmails();

  const { data: emailQueue = [], isLoading: isLoadingQueue, refetch: refetchQueue } = useQuery({
    queryKey: ['admin-email-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching email queue:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const { data: emailTemplates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['admin-email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_key', { ascending: true });
      
      if (error) {
        console.error('Error fetching email templates:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleProcessEmails = async () => {
    try {
      await processEmails.mutateAsync();
      refetchQueue();
    } catch (error) {
      console.error('Error processing emails:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getQueueStats = () => {
    const pending = emailQueue.filter(email => email.status === 'pending').length;
    const sent = emailQueue.filter(email => email.status === 'sent').length;
    const failed = emailQueue.filter(email => email.status === 'failed').length;
    
    return { pending, sent, failed };
  };

  const stats = getQueueStats();

  return (
    <div className="space-y-6">
      {/* Email Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Emails</p>
                <p className="text-2xl font-bold">{emailQueue.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Management Tabs */}
      <Tabs defaultValue="queue" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="queue">Email Queue</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleProcessEmails}
              disabled={processEmails.isPending}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Process Emails</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => refetchQueue()}
              disabled={isLoadingQueue}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Email Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingQueue ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailQueue.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">User</p>
                            <p className="text-sm text-gray-500">{email.recipient_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{email.template_key}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                        <TableCell>{getStatusBadge(email.status)}</TableCell>
                        <TableCell>{new Date(email.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          {email.sent_at ? new Date(email.sent_at).toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTemplates ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Key</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <Badge variant="outline">{template.template_key}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                        <TableCell>
                          {template.is_active ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(template.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailManagementTab;
