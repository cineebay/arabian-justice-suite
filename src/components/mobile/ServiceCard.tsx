import { Link } from 'react-router-dom';
import { Scale, Users, Briefcase, Building, Hammer, MessageCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: Record<string, LucideIcon> = {
  scale: Scale,
  users: Users,
  briefcase: Briefcase,
  building: Building,
  hammer: Hammer,
  'message-circle': MessageCircle,
};

export function ServiceCard({ id, title, description, icon, className }: ServiceCardProps) {
  const Icon = iconMap[icon] || Scale;
  
  return (
    <Link
      to={`/services/${id}`}
      className={cn(
        "block bg-card rounded-xl p-5 shadow-md border border-border/50",
        "transition-all duration-300 hover:shadow-lg hover:border-secondary/50",
        "animate-fade-in",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </div>
    </Link>
  );
}
