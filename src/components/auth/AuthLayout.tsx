
import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
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

      {/* Right side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold leading-tight mb-6 text-white">
                30.000+ bearbeitete Immobilienbilder für Makler, Fotografen & Architekten
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-12">
                Setzen auch Sie auf Qualität, die verkauft – mit unserer 48h Bildbearbeitung in Studioqualität.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Upload & automatische KI-Bearbeitung</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Professionelle Editing-Presets</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>PDF-Export & Download</span>
              </div>
            </motion.div>
          </div>
          
          <div className="text-sm text-white/70">
            Made with love in Augsburg.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
