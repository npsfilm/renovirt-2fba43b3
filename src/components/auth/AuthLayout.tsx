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

      {/* Right side - Enhanced Marketing Content with Immobilien Grid Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image with 10-degree rotation and closer zoom */}
        <div 
          className="absolute inset-0 transform rotate-[10deg] scale-125 origin-center"
          style={{
            backgroundImage: 'url(/lovable-uploads/fd670a2b-70f6-44eb-89b6-316c7c4280b6.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>
        
        {/* Additional gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full w-full">
          {/* Top Section - Main Content */}
          <div className="flex flex-col justify-center flex-1 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight">
                  Minimaler Aufwand
                </h1>
                <h2 className="text-3xl font-bold text-accent">
                  Maximale Aufmerksamkeit
                </h2>
                <p className="text-xl text-white/90 leading-relaxed">
                  Professionelle Immobilienbilder in Studioqualität – 48h Lieferzeit garantiert
                </p>
              </div>
              
              {/* Key Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center space-x-3 text-white/95">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium">48h Lieferzeit</span>
                </div>
                <div className="flex items-center space-x-3 text-white/95">
                  <Users className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium">30.000+ Bilder</span>
                </div>
                <div className="flex items-center space-x-3 text-white/95">
                  <Star className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium">Studioqualität</span>
                </div>
                <div className="flex items-center space-x-3 text-white/95">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium">Zuverlässig</span>
                </div>
              </div>
            </motion.div>

            {/* Testimonial Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mt-8"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-accent text-accent" />
                ))}
                <span className="text-sm font-medium text-white/90 ml-2">4.9/5</span>
                <span className="text-xs text-white/70 ml-1">(2.847 Bewertungen)</span>
              </div>
              <p className="text-white/90 italic text-lg leading-relaxed mb-4">
                "Renovirt hat unsere Immobilienvermarktung revolutioniert. Die Bildqualität ist außergewöhnlich und die Bearbeitungszeit unschlagbar!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  MS
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Maria Schmidt</p>
                  <p className="text-white/70 text-xs">Immobilienmaklerin, RE/MAX</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Bottom Section - Partner Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-white/70 text-sm text-center">
              Vertraut von führenden Immobilienunternehmen
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-70">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-semibold text-sm">RE/MAX</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-semibold text-sm">Century 21</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-semibold text-sm">Engel & Völkers</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs">
                Made with love in Augsburg.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
