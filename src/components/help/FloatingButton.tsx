
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <div className="fixed bottom-24 right-4 z-[60] md:bottom-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              size="lg"
              aria-label="Support & Hilfe öffnen"
              className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Support & Hilfe</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingButton;
