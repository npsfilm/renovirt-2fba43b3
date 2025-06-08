
import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/9ec7c3ad-34b9-4fea-a9e9-0d4a0a5532e9.png" 
            alt="Renovirt Logo" 
            className="h-8 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Willkommen zurück
          </h1>
          <p className="text-muted-foreground">
            Professionelle Immobilienfotos in Studioqualität
          </p>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
