
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Check, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

const NotificationDropdown = () => {
  const { data: notifications = [] } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
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
          <h3 className="font-semibold text-lg">Notifications</h3>
          <p className="text-sm text-gray-500">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={`m-2 ${!notification.is_read ? 'border-blue-200' : ''}`}>
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
