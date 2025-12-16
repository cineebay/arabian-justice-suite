import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkText?: string;
  className?: string;
}

export function SectionHeader({ title, linkTo, linkText = 'عرض الكل', className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-sm font-medium text-secondary hover:text-gold-dark transition-colors"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
