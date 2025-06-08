
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedLoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  showText?: boolean;
  variant?: 'default' | 'minimal' | 'with-background';
}

const UnifiedLoading = ({ 
  className, 
  size = 'md', 
  text = 'Laden...', 
  showText = true,
  variant = 'default'
}: UnifiedLoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const baseClasses = "flex flex-col items-center justify-center";
  
  const variantClasses = {
    default: "space-y-3",
    minimal: "space-y-2",
    'with-background': "space-y-4 p-8 bg-background/80 backdrop-blur-sm rounded-lg border"
  };

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        sizeClasses[size]
      )} />
      {showText && (
        <p className={cn(
          "text-muted-foreground font-light",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default UnifiedLoading;
