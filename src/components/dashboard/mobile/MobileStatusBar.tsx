import React from 'react';

const MobileStatusBar = () => {
  return (
    <div className="flex items-center justify-center px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">L</span>
        </div>
        <span className="font-semibold text-foreground">Lovable</span>
      </div>
    </div>
  );
};

export default MobileStatusBar;