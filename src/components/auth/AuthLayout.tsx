
import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12 text-center">
            <img 
              src="/lovable-uploads/9ec7c3ad-34b9-4fea-a9e9-0d4a0a5532e9.png" 
              alt="Renovirt Logo" 
              className="h-10 mx-auto mb-8"
            />
          </div>
          {children}
        </motion.div>
      </div>

      {/* Right side - Marketing Content with enhanced gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/60 via-accent/70 to-primary/80 relative overflow-hidden">
        {/* Additional gradient overlay for more depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/50 via-transparent to-primary/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-primary/40"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-foreground h-full w-full">
          <div className="flex flex-col justify-center items-center h-full max-w-lg text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold leading-tight text-foreground">
                30.000+ bearbeitete Immobilienbilder für Makler, Fotografen & Architekten
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                Setzen auch Sie auf Qualität, die verkauft – mit unserer 48h Bildbearbeitung in Studioqualität.
              </p>
            </motion.div>
          </div>
          
          <div className="absolute bottom-12 text-sm text-foreground/70">
            Made with love in Augsburg.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
