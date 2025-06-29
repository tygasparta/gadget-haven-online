
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Bell, Check, AlertTriangle, Info, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { useCreateSampleNotifications } from '@/hooks/useCreateSampleNotifications';
import { useToast } from '@/hooks/use-toast';

const NotificationDropdown = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: createSampleNotifications, isPending } = useCreateSampleNotifications();
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, {
      onSuccess: () => {
        toast({
          title: "Notification marked as read",
          description: "The notification has been marked as read.",
        });
      },
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500 relative"
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-sm text-gray-500">
                {unreadCount} unread notifications
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => createSampleNotifications()}
              disabled={isPending}
              className="h-8 w-8 p-0"
              title="Create sample notifications"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-xs mt-1">Click the + button to create sample notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={`m-2 ${!notification.is_read ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
