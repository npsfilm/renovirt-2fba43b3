import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Users, Clock } from 'lucide-react';
interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({
  children
}: AuthLayoutProps) => {
  return <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-3/5 xl:w-1/2 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-background">
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="w-full max-w-md">
          <div className="mb-3 sm:mb-4 lg:mb-6 text-center">
            <img src="/lovable-uploads/9ec7c3ad-34b9-4fea-a9e9-0d4a0a5532e9.png" alt="Renovirt Logo" className="h-6 sm:h-7 lg:h-8 mx-auto mb-2 sm:mb-3 lg:mb-4" />
          </div>
          {children}
        </motion.div>
      </div>

      {/* Right side - Enhanced Marketing Content with Immobilien Grid Background */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative overflow-hidden h-full">
        {/* Background Image with 10-degree rotation and closer zoom */}
        <div className="absolute inset-0 transform rotate-[10deg] scale-125 origin-center" style={{
        backgroundImage: 'url(/lovable-uploads/fd670a2b-70f6-44eb-89b6-316c7c4280b6.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>
        
        {/* Additional gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-4 lg:p-6 xl:p-8 text-white h-full w-full">
          {/* Top Section - Main Content */}
          <div className="flex flex-col justify-center flex-1 max-w-lg">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="space-y-2 lg:space-y-3 xl:space-y-4">
              {/* Main Headline */}
              <div className="space-y-2 lg:space-y-3">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">Willkommen bei Renovirt</h1>
                <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-accent">Professionelle Bildbearbeitung für Immobilien – in 48 Stunden.</h2>
                <p className="text-sm lg:text-base xl:text-lg text-white/90 leading-relaxed">Melden Sie sich an, um neue Aufträge zu starten oder Ihre Projekte zu verwalten.</p>
              </div>
              
              {/* Key Benefits Grid */}
              <div className="space-y-2 lg:space-y-3 mt-3 lg:mt-4 xl:mt-6">
                <div className="flex items-center space-x-2 lg:space-x-3 text-white/95">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-accent flex-shrink-0" />
                  <span className="text-xs lg:text-sm font-medium">Über 30.000 bearbeitete Bilder</span>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3 text-white/95">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-accent flex-shrink-0" />
                  <span className="text-xs lg:text-sm font-medium">48h Bearbeitungszeit</span>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3 text-white/95">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-accent flex-shrink-0" />
                  <span className="text-xs lg:text-sm font-medium">Bearbeitung durch erfahrene Immobilien-Editor:innen</span>
                </div>
                
                <div className="mt-2 lg:mt-3 xl:mt-4 pt-2 lg:pt-3 xl:pt-4 border-t border-white/20">
                  <p className="text-sm lg:text-base font-semibold text-white mb-1">
                    Effizient. Verlässlich. Hochwertig.
                  </p>
                  <p className="text-xs lg:text-sm text-white/80">
                    Für Makler, Fotografen und Architekten.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="bg-white/10 backdrop-blur-md rounded-lg lg:rounded-xl p-3 lg:p-4 border border-white/20 mt-3 lg:mt-4 xl:mt-6">
              <div className="flex items-center space-x-1 mb-2 lg:mb-3">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-3 h-3 lg:w-4 lg:h-4 fill-accent text-accent" />)}
                <span className="text-xs lg:text-sm font-medium text-white/90 ml-1 lg:ml-2">4.6/5</span>
                <span className="text-xs text-white/70 ml-1">(1.847 Bewertungen)</span>
              </div>
              <p className="text-white/90 italic text-xs lg:text-sm xl:text-base leading-relaxed mb-2 lg:mb-3">
                "Renovirt hat unsere Immobilienvermarktung revolutioniert. Die Bildqualität ist außergewöhnlich und die Bearbeitungszeit unschlagbar!"
              </p>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                  MS
                </div>
                <div>
                  <p className="text-white font-semibold text-xs lg:text-sm">Maria Schmidt</p>
                  <p className="text-white/70 text-xs">Immobilienmaklerin</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Bottom Section - Partner Logos */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }} className="space-y-2 lg:space-y-3">
            <p className="text-white/70 text-xs text-center">
              Vertraut von führenden Immobilienunternehmen
            </p>
            <div className="flex items-center justify-center space-x-2 lg:space-x-3 xl:space-x-4 opacity-70">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 flex items-center justify-center h-6 lg:h-7 xl:h-8">
                <img src="/lovable-uploads/3edc84fd-1de7-4266-ac80-24a4925dd856.png" alt="Engel & Völkers" className="h-3 lg:h-4 xl:h-5 max-w-[60px] lg:max-w-[70px] xl:max-w-[80px] object-contain" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 flex items-center justify-center h-6 lg:h-7 xl:h-8">
                <img src="/lovable-uploads/e6bd750d-a87a-45ce-84cf-065e03bd72c7.png" alt="Century 21" className="h-3 lg:h-4 xl:h-5 max-w-[60px] lg:max-w-[70px] xl:max-w-[80px] object-contain" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 flex items-center justify-center h-6 lg:h-7 xl:h-8">
                <img src="/lovable-uploads/8c510237-f833-4180-8a51-f663f2012aee.png" alt="Volksbank" className="h-3 lg:h-4 xl:h-5 max-w-[60px] lg:max-w-[70px] xl:max-w-[80px] object-contain" />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 lg:space-x-3 xl:space-x-4 opacity-70">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 flex items-center justify-center h-6 lg:h-7 xl:h-8">
                <img src="/lovable-uploads/4127c5fe-1b1e-427e-bd36-ef661e04f853.png" alt="Bricks & Mortar" className="h-3 lg:h-4 xl:h-5 max-w-[60px] lg:max-w-[70px] xl:max-w-[80px] object-contain" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 flex items-center justify-center h-6 lg:h-7 xl:h-8">
                <img src="/lovable-uploads/5c28de02-7e7b-4dfa-9009-20e385d6295a.png" alt="McMakler" className="h-3 lg:h-4 xl:h-5 max-w-[60px] lg:max-w-[70px] xl:max-w-[80px] object-contain" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 flex items-center justify-center h-6 lg:h-7 xl:h-8">
                <img src="/lovable-uploads/34d808bf-8414-4e4d-9dd4-cda24c19367d.png" alt="Von Poll" className="h-3 lg:h-4 xl:h-5 max-w-[60px] lg:max-w-[70px] xl:max-w-[80px] object-contain" />
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
    </div>;
};
export default AuthLayout;