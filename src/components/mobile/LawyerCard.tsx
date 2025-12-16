import { Link } from 'react-router-dom';
import { Star, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lawyer } from '@/data/mockData';

interface LawyerCardProps {
  lawyer: Lawyer;
  variant?: 'default' | 'compact';
  className?: string;
  style?: React.CSSProperties;
}

export function LawyerCard({ lawyer, variant = 'default', className }: LawyerCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/lawyers/${lawyer.id}`}
        className={cn(
          "flex-shrink-0 w-36 bg-card rounded-xl p-4 shadow-md border border-border/50",
          "transition-all duration-300 hover:shadow-lg hover:border-secondary/50",
          className
        )}
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-gold mb-3 overflow-hidden">
          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-secondary">
            {lawyer.name.charAt(0)}
          </div>
        </div>
        <h4 className="font-bold text-sm text-center text-foreground line-clamp-1">{lawyer.name}</h4>
        <p className="text-xs text-center text-secondary mt-1">{lawyer.specialty}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Star className="w-3 h-3 fill-secondary text-secondary" />
          <span className="text-xs text-muted-foreground">{lawyer.rating}</span>
        </div>
      </Link>
    );
  }
  
  return (
    <Link
      to={`/lawyers/${lawyer.id}`}
      className={cn(
        "block bg-card rounded-xl p-5 shadow-md border border-border/50",
        "transition-all duration-300 hover:shadow-lg hover:border-secondary/50",
        "animate-fade-in",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-gold overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-secondary">
            {lawyer.name.charAt(0)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground">{lawyer.name}</h3>
          <p className="text-sm text-secondary mt-0.5">{lawyer.specialty}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="text-sm text-muted-foreground">{lawyer.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{lawyer.experience} سنة</span>
            </div>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </div>
    </Link>
  );
}
