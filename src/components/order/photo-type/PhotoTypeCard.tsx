
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface PhotoTypeCardProps {
  id: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  title: string;
  description: string;
  icon: LucideIcon;
  isSelected: boolean;
}

const PhotoTypeCard = ({ id, title, description, icon: IconComponent, isSelected }: PhotoTypeCardProps) => {
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
        <CardContent className="p-6 text-center relative">
          <div className="absolute top-4 right-4">
            <RadioGroupItem 
              value={id} 
              id={id} 
              className={`w-5 h-5 transition-colors duration-200 ${
                isSelected ? 'border-primary text-primary' : 'border-muted-foreground'
              }`}
            />
          </div>
          
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300
            ${isSelected 
              ? 'bg-primary/10 shadow-md' 
              : 'bg-muted group-hover:bg-muted/80'
            }
          `}>
            <IconComponent className={`
              w-8 h-8 transition-all duration-300
              ${isSelected 
                ? 'text-primary' 
                : 'text-muted-foreground group-hover:text-foreground'
              }
            `} />
          </div>
          
          <h3 className={`
            text-lg font-semibold mb-2 transition-colors duration-300
            ${isSelected ? 'text-foreground' : 'text-foreground'}
          `}>
            {title}
          </h3>
          
          <p className={`
            text-sm leading-relaxed transition-colors duration-300
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
