import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  to: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function QuickAction({ to, icon: Icon, label, className }: QuickActionProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-md border border-border/50",
        "transition-all duration-300 hover:shadow-lg hover:border-secondary/50 hover:scale-[1.02]",
        "active:scale-[0.98]",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-secondary" />
      </div>
      <span className="text-sm font-semibold text-foreground text-center">{label}</span>
    </Link>
  );
}
