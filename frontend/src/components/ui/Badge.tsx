import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'bg-primary/10 text-primary border border-primary/20': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-border text-foreground': variant === 'outline',
          'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20': variant === 'success',
          'bg-amber-500/10 text-amber-500 border border-amber-500/20': variant === 'warning',
          'bg-violet-500/10 text-violet-400 border border-violet-500/20': variant === 'purple',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
