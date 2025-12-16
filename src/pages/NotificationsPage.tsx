import { useState } from 'react';
import { Bell, Calendar, FileText, MessageSquare, Check, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNotifications, notificationsApi } from '@/hooks/useApiData';
import { Skeleton } from '@/components/ui/skeleton';

const typeIcons: Record<string, typeof Bell> = {
  appointment: Calendar,
  case: FileText,
  message: MessageSquare,
  general: Bell,
};

const typeColors: Record<string, string> = {
  appointment: 'bg-success/10 text-success',
  case: 'bg-warning/10 text-warning',
  message: 'bg-blue-500/10 text-blue-600',
  general: 'bg-secondary/10 text-secondary',
};

const typeLabels: Record<string, string> = {
  all: 'الكل',
  appointment: 'المواعيد',
  case: 'القضايا',
  message: 'الرسائل',
  general: 'عام',
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const { data: notifications, loading, refetch, setData } = useNotifications();
  const [filterType, setFilterType] = useState<string>('all');

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      // Update local state
      setData(notifications.map(n => ({ ...n, isRead: true, is_read: 1 })));
      toast({
        title: "تم التحديث",
        description: "تم تعليم جميع الإشعارات كمقروءة",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإشعارات",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setData(notifications.map(n => 
        n.id === id ? { ...n, isRead: true, is_read: 1 } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `منذ ${days} يوم`;
    if (hours > 0) return `منذ ${hours} ساعة`;
    return 'منذ قليل';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    return notification.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">الإشعارات</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} إشعارات غير مقروءة` : 'جميع الإشعارات مقروءة'}
            </p>
          </div>
          <Button variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <Check className="w-4 h-4" />
            تعليم الكل كمقروء
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {Object.entries(typeLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={filterType === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(key)}
              className={cn(
                filterType === key && 'bg-secondary text-secondary-foreground'
              )}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = typeIcons[notification.type] || Bell;
              const isRead = notification.isRead || notification.is_read;
              const createdAt = notification.createdAt || notification.created_at || '';
              
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "hover:shadow-md transition-shadow cursor-pointer",
                    !isRead && "border-secondary/50 bg-secondary/5"
                  )}
                  onClick={() => !isRead && handleMarkAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        typeColors[notification.type]
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cn(
                            "font-medium text-foreground",
                            !isRead && "font-bold"
                          )}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatTime(createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      {!isRead && (
                        <div className="w-2 h-2 bg-secondary rounded-full shrink-0 mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {filterType === 'all' ? 'لا توجد إشعارات' : 'لا توجد إشعارات في هذا التصنيف'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
