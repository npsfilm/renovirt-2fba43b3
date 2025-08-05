
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <div className="fixed bottom-24 right-4 z-60 md:bottom-4">
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingButton;
