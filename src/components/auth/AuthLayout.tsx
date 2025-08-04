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
        
        
      </div>
    </div>;
};
export default AuthLayout;