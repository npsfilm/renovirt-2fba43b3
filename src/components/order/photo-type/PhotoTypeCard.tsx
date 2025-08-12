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
}

const PhotoTypeCard = ({
  id,
  title,
  description,
  icon: IconComponent,
  isSelected
}: PhotoTypeCardProps) => {
  const isMobile = useIsMobile();

    return (
      <Label htmlFor={id} className="cursor-pointer block">
        <Card
          className={`
            relative overflow-hidden transition-all duration-300 ease-out
            ${isSelected ? 'shadow-xl border-primary/30 bg-primary/5 shadow-primary/15 scale-[1.02]' : 'shadow-lg border-border bg-card hover:shadow-xl hover:border-border active:scale-[0.98]'}
            border-2 rounded-2xl w-full min-h-[64px]
          `}
        >
          <CardContent className="p-2 relative">
            {/* Hidden radio button for form functionality */}
            <RadioGroupItem value={id} id={id} className="sr-only" />

            <div className="flex items-start gap-2">
              {/* Icon */}
              <div
                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-sm
                  ${isSelected ? 'bg-primary/10 shadow-lg shadow-primary/20' : 'bg-muted'}
                `}
              >
                <IconComponent
                  className={`
                    w-4 h-4 transition-all duration-300 transform origin-center
                    text-foreground
                  `}
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-left min-w-0">
                <h3
                  className={`
                    text-sm font-medium mb-0.5 leading-tight transition-colors duration-300
                    ${isSelected ? 'text-foreground' : 'text-foreground'}
                  `}
                >
                  {title}
                </h3>

                <p className="text-xs text-muted-foreground leading-snug truncate">
                  {description}
                </p>
              </div>
            </div>

            {/* Subtiles Border-Highlight im ausgewählten Zustand */}
            {isSelected && (
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/40 pointer-events-none"></div>
            )}
          </CardContent>
        </Card>
      </Label>
    );
  }

  // Desktop-Design (unverändert)
  return (
    <Label htmlFor={id} className="cursor-pointer group">
      <Card
        className={`
          relative overflow-hidden transition-all duration-300 ease-out transform
          ${isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.02] bg-gradient-to-br from-primary/10 to-primary/20' : 'hover:shadow-md hover:scale-[1.01] border-border bg-card'}
          border h-full
        `}
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
