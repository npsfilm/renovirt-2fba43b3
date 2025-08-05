
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
    // Airbnb-style mobile design
    return (
      <Label htmlFor={id} className="cursor-pointer block">
        <Card className={`
          relative overflow-hidden transition-all duration-200 ease-out active:scale-[0.98]
          ${isSelected 
            ? 'shadow-lg border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 shadow-rose-100/40'
            : 'shadow-md border-gray-200 bg-white hover:shadow-lg hover:border-gray-300'
          }
          border rounded-2xl w-full min-h-[80px]
        `}>
          <CardContent className="p-6 relative">
            {/* Hidden radio button for form functionality */}
            <RadioGroupItem 
              value={id} 
              id={id} 
              className="sr-only"
            />
            
            <div className="flex items-center gap-5">
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0
                ${isSelected 
                  ? 'bg-rose-100 shadow-sm' 
                  : 'bg-gray-100'
                }
              `}>
                <IconComponent className={`
                  w-7 h-7 transition-all duration-200
                  ${isSelected 
                    ? 'text-rose-600' 
                    : 'text-gray-600'
                  }
                `} />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className={`
                  text-lg font-semibold mb-1 transition-colors duration-200
                  ${isSelected ? 'text-gray-900' : 'text-gray-800'}
                `}>
                  {title}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed transition-colors duration-200
                  ${isSelected ? 'text-gray-700' : 'text-gray-600'}
                `}>
                  {description}
                </p>
              </div>

              {/* Airbnb-style checkmark indicator */}
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0
                ${isSelected 
                  ? 'bg-rose-600 shadow-sm' 
                  : 'border-2 border-gray-300 bg-white'
                }
              `}>
                {isSelected && (
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
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
