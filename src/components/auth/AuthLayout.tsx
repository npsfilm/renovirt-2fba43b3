
import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Users, Clock } from 'lucide-react';

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

      {/* Right side - Enhanced Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/60 via-accent/70 to-primary/80 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-primary/30 rounded-full blur-xl"></div>
        
        {/* Additional gradient overlay for more depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/50 via-transparent to-primary/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-primary/40"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-foreground h-full w-full">
          <div className="flex flex-col justify-center items-center h-full max-w-lg text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Enhanced Value Proposition */}
              <h1 className="text-4xl font-bold leading-tight text-foreground">
                Immobilienbilder die verkaufen
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                Professionelle Bildbearbeitung in Studioqualität – 48h Lieferzeit garantiert
              </p>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center space-x-2 text-foreground/90">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">48h Lieferzeit</span>
                </div>
                <div className="flex items-center space-x-2 text-foreground/90">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">30.000+ Bilder</span>
                </div>
                <div className="flex items-center space-x-2 text-foreground/90">
                  <Star className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Studioqualität</span>
                </div>
                <div className="flex items-center space-x-2 text-foreground/90">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Zuverlässig</span>
                </div>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-foreground/20"
            >
              <div className="flex items-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-accent text-accent" />
                ))}
                <span className="text-sm font-medium text-foreground/90 ml-2">4.9/5</span>
              </div>
              <p className="text-sm text-foreground/80 italic">
                "Renovirt hat unsere Immobilienvermarktung revolutioniert. Die Bildqualität ist außergewöhnlich!"
              </p>
              <p className="text-xs text-foreground/60 mt-2 font-medium">
                - Maria Schmidt, Immobilienmaklerin
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
