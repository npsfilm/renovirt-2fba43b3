
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

const PhotoTypeCard = ({ id, title, description, icon: IconComponent, isSelected }: PhotoTypeCardProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile full-width button design
    return (
      <Label htmlFor={id} className="cursor-pointer block col-span-2">
        <Card className={`
          relative overflow-hidden transition-all duration-300 ease-out transform
          ${isSelected 
            ? 'ring-4 ring-primary border-primary bg-primary/10 shadow-xl scale-[1.01]'
            : 'border-border bg-card hover:shadow-lg hover:border-primary/30'
          }
          border-2 w-full
        `}>
          <CardContent className="p-6 relative">
            {/* Hidden radio button for form functionality */}
            <RadioGroupItem 
              value={id} 
              id={id} 
              className="sr-only"
            />
            
            <div className="flex items-center gap-4">
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                ${isSelected 
                  ? 'bg-primary/20 shadow-lg' 
                  : 'bg-muted'
                }
              `}>
                <IconComponent className={`
                  w-8 h-8 transition-all duration-300
                  ${isSelected 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                  }
                `} />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className={`
                  text-xl font-bold mb-2 transition-colors duration-300
                  ${isSelected ? 'text-primary' : 'text-foreground'}
                `}>
                  {title}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed transition-colors duration-300
                  ${isSelected ? 'text-foreground/90' : 'text-muted-foreground'}
                `}>
                  {description}
                </p>
              </div>

              {/* Visual selection indicator */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${isSelected 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground'
                }
              `}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Label>
    );
  }

  // Desktop design (unchanged)
  return (
    <Label htmlFor={id} className="cursor-pointer group">
      <Card className={`
        relative overflow-hidden transition-all duration-300 ease-out transform
        ${isSelected 
          ? 'ring-2 ring-primary shadow-lg scale-[1.02] bg-gradient-to-br from-primary/10 to-primary/20'
          : 'hover:shadow-md hover:scale-[1.01] border-border bg-card'
        }
        border h-full
      `}>
        <CardContent className="p-3 md:p-6 text-center relative">
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
            <RadioGroupItem 
              value={id} 
              id={id} 
              className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-200 ${
                isSelected ? 'border-primary text-primary' : 'border-muted-foreground'
              }`}
            />
          </div>
          
          <div className={`
            w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 transition-all duration-300
            ${isSelected 
              ? 'bg-primary/10 shadow-md' 
              : 'bg-muted group-hover:bg-muted/80'
            }
          `}>
            <IconComponent className={`
              w-5 h-5 md:w-8 md:h-8 transition-all duration-300
              ${isSelected 
                ? 'text-primary' 
                : 'text-muted-foreground group-hover:text-foreground'
              }
            `} />
          </div>
          
          <h3 className={`
            text-sm md:text-lg font-semibold mb-1 md:mb-2 transition-colors duration-300
            ${isSelected ? 'text-foreground' : 'text-foreground'}
          `}>
            {title}
          </h3>
          
          <p className={`
            text-xs md:text-sm leading-relaxed transition-colors duration-300 line-clamp-3
            ${isSelected ? 'text-foreground/80' : 'text-muted-foreground'}
          `}>
            {description}
          </p>
        </CardContent>
      </Card>
    </Label>
  );
};

export default PhotoTypeCard;
