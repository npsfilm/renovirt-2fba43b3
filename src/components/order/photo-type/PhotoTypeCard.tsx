import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PhotoTypeCardProps {
  id: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  title: string;
  description: string;
  icon: LucideIcon | string;
  isCustomImage?: boolean;
  isSelected: boolean;
  setPhotoType?: (id: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5') => void;
}

const PhotoTypeCard = ({
  id,
  title,
  description,
  icon,
  isCustomImage = false,
  isSelected,
  setPhotoType
}: PhotoTypeCardProps) => {
  const isMobile = useIsMobile();

  // FORCE COMPACT MOBILE LAYOUT - NO CONDITIONS
  return (
    <Label htmlFor={id} className="cursor-pointer block my-[0.2rem] sm:my-[0.4rem]">
      <Card
        className={`
          relative overflow-hidden transition-all duration-300 ease-out group
          ${isSelected ? 'ring-2 ring-primary shadow-xl bg-primary/10' : 'shadow-md border-border bg-card hover:shadow-lg hover:border-primary/20'}
          border-2 rounded-3xl w-full h-[110px]
        `}
        onClick={() => setPhotoType?.(id)}
      >
        <CardContent className="p-4 relative h-full">
          {/* Hidden radio button for form functionality */}
          <RadioGroupItem value={id} id={id} className="sr-only" />

          <div className="flex items-center gap-3 h-full">
            {/* Icon */}
            <div className="flex items-center justify-center flex-shrink-0">
              {isCustomImage ? (
                <img
                  src={icon as string}
                  alt={title}
                  className="h-[72px] md:h-20 w-auto object-contain transition-all duration-300"
                />
              ) : (
                React.createElement(icon as LucideIcon, {
                  className: `h-12 w-12 transition-all duration-300 ${isSelected ? 'text-primary' : 'text-foreground'}`
                })
              )}
            </div>

            {/* Content */}
            <div className="flex-1 text-left min-w-0 flex flex-col justify-center">
              <h3
                className={`
                  text-xl font-bold mb-1 leading-tight transition-colors duration-300
                  ${isSelected ? 'text-foreground' : 'text-foreground'}
                `}
              >
                {title}
              </h3>

              <p className="text-base text-muted-foreground leading-snug line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
          )}
        </CardContent>
      </Card>
    </Label>
  );

  // Desktop-Design (unverändert) 
  // Note: This code is unreachable due to early return above
};

export default PhotoTypeCard;
