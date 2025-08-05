import React from 'react';

const MobileStatusBar = () => {
  return (
    <div className="flex items-center justify-center px-2 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
      {/* Logo */}
      <img 
        src="/lovable-uploads/d6ac9ba9-7ad2-408b-a2b0-5f31c269dd53.png" 
        alt="Renovirt Logo" 
        className="h-8 w-auto" 
      />
    </div>
  );
};

export default MobileStatusBar;