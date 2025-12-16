import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Calendar, FileText, Users, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'الرئيسية' },
  { path: '/appointments', icon: Calendar, label: 'المواعيد' },
  { path: '/cases', icon: FileText, label: 'الملفات' },
  { path: '/lawyers', icon: Users, label: 'المحامون' },
  { path: '/profile', icon: User, label: 'حسابي' },
];

export function MobileLayout({ children, title, showBack = false, showNotifications = true }: MobileLayoutProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          {showBack ? (
            <Link to="/" className="p-2 -mr-2 hover:bg-teal-light rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="شركة راشد الدوسري للمحاماة" 
                className="h-14 w-auto object-contain bg-white rounded-lg px-2 py-1"
              />
            </div>
          )}
          
          {title && <h1 className="text-lg font-bold">{title}</h1>}
          
          {showNotifications && (
            <Link to="/notifications" className="p-2 -ml-2 hover:bg-teal-light rounded-lg transition-colors relative">
              <Bell size={24} />
              <span className="absolute top-1 left-1 w-2 h-2 bg-secondary rounded-full"></span>
            </Link>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-secondary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-xs", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
