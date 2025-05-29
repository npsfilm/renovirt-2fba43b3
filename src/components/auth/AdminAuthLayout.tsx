
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

interface AdminAuthLayoutProps {
  children: React.ReactNode;
}

const AdminAuthLayout = ({ children }: AdminAuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Admin Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-8">
              <ArrowLeft className="w-6 h-6" />
              <span>Renovirt Admin</span>
            </Link>
          </div>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8" />
                <h2 className="text-4xl font-bold">
                  Management Portal
                </h2>
              </div>
              <p className="text-xl text-white/90">
                Verwaltung und Überwachung der Renovirt-Plattform
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
                <span>Bestellungen verwalten</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Kunden überwachen</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Systemanalyse & Berichte</span>
              </div>
            </motion.div>
          </div>
          
          <div className="text-sm text-white/70">
            © 2024 Renovirt Admin. Alle Rechte vorbehalten.
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAuthLayout;
