import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  Bell,
  Scale,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { officeLawyer, notifications } from '@/data/mockData';
import logo from '@/assets/logo.png';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'لوحة التحكم', labelEn: 'Dashboard' },
  { path: '/clients', icon: Users, label: 'الموكلين', labelEn: 'Clients' },
  { path: '/appointments', icon: Calendar, label: 'المواعيد', labelEn: 'Appointments' },
  { path: '/cases', icon: FileText, label: 'الملفات', labelEn: 'Cases' },
  { path: '/consultations', icon: MessageSquare, label: 'الاستشارات', labelEn: 'Consultations' },
  { path: '/services', icon: Briefcase, label: 'الخدمات', labelEn: 'Services' },
  { path: '/settings', icon: Settings, label: 'الإعدادات', labelEn: 'Settings' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 right-0 z-50 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out lg:transform-none",
        sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-center">
              <img 
                src={logo} 
                alt="شركة راشد الدوسري للمحاماة" 
                className="h-14 w-auto object-contain bg-white rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-secondary text-secondary-foreground shadow-lg" 
                      : "hover:bg-white/10 text-white/80 hover:text-white"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10 mt-auto sticky bottom-0 bg-primary">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-secondary-foreground">
                  {officeLawyer.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{officeLawyer.name}</p>
                <p className="text-xs text-gold truncate">{officeLawyer.specialty}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </Button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold text-foreground">
                  {navItems.find(item => item.path === location.pathname)?.label || 'مكتب المحاماة'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('ar-MA', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-secondary-foreground">
                    {officeLawyer.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium">{officeLawyer.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
