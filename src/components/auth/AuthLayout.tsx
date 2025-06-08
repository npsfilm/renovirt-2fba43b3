
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

      {/* Right side - Marketing Content with gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-accent/30 to-primary/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-foreground h-full">
          <div className="max-w-lg text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold leading-tight mb-6 text-foreground">
                30.000+ bearbeitete Immobilienbilder für Makler, Fotografen & Architekten
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Setzen auch Sie auf Qualität, die verkauft – mit unserer 48h Bildbearbeitung in Studioqualität.
              </p>
            </motion.div>
          </div>
          
          <div className="absolute bottom-12 text-sm text-muted-foreground">
            Made with love in Augsburg.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
