import { User, Calendar, FileText, MessageCircle, Bell, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: Calendar, label: 'مواعيدي', to: '/appointments', count: 3 },
  { icon: FileText, label: 'ملفاتي القضائية', to: '/cases', count: 2 },
  { icon: MessageCircle, label: 'استشاراتي', to: '/consultations', count: 1 },
  { icon: Bell, label: 'الإشعارات', to: '/notifications', count: 5 },
  { icon: Settings, label: 'الإعدادات', to: '/settings' },
];

export default function ProfilePage() {
  return (
    <MobileLayout title="الملف الشخصي" showBack>
      <div className="animate-fade-in">
        {/* Profile Header */}
        <div className="bg-gradient-navy px-5 py-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-gold overflow-hidden mb-4">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-secondary">
              م
            </div>
          </div>
          <h1 className="text-xl font-bold text-primary-foreground mb-1">محمد عبدالرحمن</h1>
          <p className="text-sm text-gold-light">mohammed@email.com</p>
          <Link to="/profile/edit">
            <Button variant="gold-outline" size="sm" className="mt-4 text-gold-light border-gold-light hover:bg-gold-light/10">
              تعديل الملف الشخصي
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="px-5 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 text-center shadow-md border border-border/50">
              <p className="text-2xl font-bold text-secondary">3</p>
              <p className="text-xs text-muted-foreground">مواعيد</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-md border border-border/50">
              <p className="text-2xl font-bold text-secondary">2</p>
              <p className="text-xs text-muted-foreground">ملفات</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-md border border-border/50">
              <p className="text-2xl font-bold text-secondary">1</p>
              <p className="text-xs text-muted-foreground">استشارات</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count && (
                    <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <Button variant="outline" size="lg" className="w-full mt-6 text-destructive border-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
