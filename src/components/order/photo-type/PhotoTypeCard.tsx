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
  icon: LucideIcon;
  isSelected: boolean;
  setPhotoType?: (id: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5') => void;
}

const PhotoTypeCard = ({
  id,
  title,
  description,
  icon: IconComponent,
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
        <CardContent className="p-[1.375rem] relative h-full">
          {/* Hidden radio button for form functionality */}
          <RadioGroupItem value={id} id={id} className="sr-only" />

          <div className="flex items-center gap-[1.15rem] h-full">
            {/* Icon */}
            <div
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-md
                ${isSelected ? 'bg-primary/20 shadow-lg shadow-primary/30' : 'bg-gradient-to-br from-muted to-muted/80'}
              `}
            >
              <IconComponent
                className={`
                  w-7 h-7 transition-all duration-300 transform origin-center
                  ${isSelected ? 'text-primary' : 'text-foreground'}
                `}
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-left min-w-0 flex flex-col justify-center">
              <h3
                className={`
                  text-lg font-bold mb-1 leading-tight transition-colors duration-300
                  ${isSelected ? 'text-foreground' : 'text-foreground'}
                `}
              >
                {title}
              </h3>

              <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
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
  return (
    <Label htmlFor={id} className="cursor-pointer group">
      <Card
        className={`
          relative overflow-hidden transition-all duration-300 ease-out transform
          ${isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.02] bg-gradient-to-br from-primary/10 to-primary/20' : 'hover:shadow-md hover:scale-[1.01] border-border bg-card'}
          border h-full
        `}
        onClick={() => setPhotoType?.(id)}
      >
        <CardContent className="p-2 md:p-4 text-center relative">
          {/* Hidden radio button for form functionality */}
          <RadioGroupItem value={id} id={id} className="sr-only" />

          <div
            className={`
              w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-1 md:mb-2 transition-all duration-300
              ${isSelected ? 'bg-primary/10 shadow-md' : 'bg-muted group-hover:bg-muted/80'}
            `}
          >
            <IconComponent
              className={`
                w-4 h-4 md:w-6 md:h-6 transition-all duration-300 transform origin-center scale-[1.2]
                ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
              `}
            />
          </div>

          <h3
            className={`
              text-xs md:text-sm font-semibold mb-1 transition-colors duration-300
              ${isSelected ? 'text-foreground' : 'text-foreground'}
            `}
          >
            {title}
          </h3>

          <p
            className={`
              text-xs leading-relaxed transition-colors duration-300 line-clamp-2
              ${isSelected ? 'text-foreground/80' : 'text-muted-foreground'}
            `}
          >
            {description}
          </p>
        </CardContent>
      </Card>
    </Label>
  );
};

export default PhotoTypeCard;
