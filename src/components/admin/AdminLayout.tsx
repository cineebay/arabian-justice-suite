import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, FileText, MessageCircle, 
  Scale, Briefcase, FolderOpen, Settings, Bell, Menu, X, 
  ChevronDown, LogOut, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', labelAr: 'لوحة التحكم' },
  { path: '/admin/users', icon: Users, label: 'Users', labelAr: 'العملاء' },
  { path: '/admin/appointments', icon: Calendar, label: 'Appointments', labelAr: 'المواعيد' },
  { path: '/admin/cases', icon: FileText, label: 'Cases', labelAr: 'الملفات' },
  { path: '/admin/consultations', icon: MessageCircle, label: 'Consultations', labelAr: 'الاستشارات' },
  { path: '/admin/lawyers', icon: Scale, label: 'Lawyers', labelAr: 'المحامون' },
  { path: '/admin/services', icon: Briefcase, label: 'Services', labelAr: 'الخدمات' },
  { path: '/admin/documents', icon: FolderOpen, label: 'Documents', labelAr: 'المستندات' },
  { path: '/admin/messages', icon: MessageCircle, label: 'Messages', labelAr: 'الرسائل' },
  { path: '/admin/settings', icon: Settings, label: 'Settings', labelAr: 'الإعدادات' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex" dir="ltr">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 bg-sidebar text-sidebar-foreground transition-all duration-300 shadow-xl",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="شركة راشد الدوسري للمحاماة" 
                className="h-10 w-auto object-contain bg-white rounded-lg px-2 py-1"
              />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}

          {/* Back to Mobile */}
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Mobile App</span>}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "mr-64" : "mr-20"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary-foreground">أ</span>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@lawfirm.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
