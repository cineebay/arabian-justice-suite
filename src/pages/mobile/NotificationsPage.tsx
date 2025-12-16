import { useState } from 'react';
import { Bell, Calendar, FileText, MessageCircle, CheckCheck, Filter } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useNotifications, notificationsApi } from '@/hooks/useApiData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const typeIcons: Record<string, LucideIcon> = {
  appointment: Calendar,
  case: FileText,
  message: MessageCircle,
  general: Bell,
};

const typeColors: Record<string, string> = {
  appointment: 'bg-blue-100 text-blue-600',
  case: 'bg-purple-100 text-purple-600',
  message: 'bg-green-100 text-green-600',
  general: 'bg-secondary/20 text-secondary',
};

const typeLabels: Record<string, string> = {
  all: 'الكل',
  appointment: 'المواعيد',
  case: 'القضايا',
  message: 'الرسائل',
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const { data: notifications, loading, setData } = useNotifications();
  const [filterType, setFilterType] = useState<string>('all');

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `منذ ${days} يوم`;
    if (hours > 0) return `منذ ${hours} ساعة`;
    return 'الآن';
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
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

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    return notification.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  return (
    <MobileLayout title="الإشعارات" showBack>
      <div className="px-5 py-4">
        {/* Mark All Read */}
        <button 
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className={cn(
            "flex items-center gap-2 text-sm mb-4 transition-colors",
            unreadCount > 0 
              ? "text-secondary hover:text-gold-dark" 
              : "text-muted-foreground cursor-not-allowed"
          )}
        >
          <CheckCheck className="w-4 h-4" />
          تحديد الكل كمقروء {unreadCount > 0 && `(${unreadCount})`}
        </button>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {Object.entries(typeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors",
                filterType === key 
                  ? "bg-secondary text-white" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl p-4 shadow-md border">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const Icon = typeIcons[notification.type] || Bell;
              const isRead = notification.isRead || notification.is_read;
              const createdAt = notification.createdAt || notification.created_at || '';
              
              return (
                <div
                  key={notification.id}
                  onClick={() => !isRead && handleMarkAsRead(notification.id)}
                  className={cn(
                    "bg-card rounded-xl p-4 shadow-md border animate-fade-in cursor-pointer",
                    isRead ? "border-border/50" : "border-secondary/50 bg-secondary/5"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      typeColors[notification.type]
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={cn(
                          "text-sm text-foreground",
                          !isRead && "font-bold"
                        )}>
                          {notification.title}
                        </h3>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatTime(createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {filterType === 'all' ? 'لا توجد إشعارات' : 'لا توجد إشعارات في هذا التصنيف'}
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
