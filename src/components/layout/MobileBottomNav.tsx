import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Upload, HelpCircle, MoreHorizontal, FileText, User, Settings, LogOut, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const MobileBottomNav = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Don't render on mobile if not needed
  if (!isMobile) return null;

  const currentPath = location.pathname;

  const mainNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
      isActive: currentPath === '/dashboard'
    },
    {
      id: 'orders',
      label: 'Meine Bestellungen',
      icon: Package,
      path: '/orders',
      isActive: currentPath === '/orders',
      isProminent: true
    },
    {
      id: 'upload',
      label: 'Hochladen',
      icon: Upload,
      path: '/order',
      isActive: currentPath === '/order'
    },
    {
      id: 'help',
      label: 'Hilfe',
      icon: HelpCircle,
      path: '/help',
      isActive: currentPath === '/help'
    }
  ];

  const moreMenuItems = [
    {
      id: 'billing',
      label: 'Rechnungen',
      icon: FileText,
      path: '/billing'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      path: '/profile'
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: Settings,
      path: '/settings'
    }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const handleMoreClick = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleLogout = () => {
    signOut();
    setIsMoreMenuOpen(false);
  };

  const isMoreActive = ['/billing', '/profile', '/settings'].includes(currentPath);

  return (
    <>
      {/* Overlay for more menu */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsMoreMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* More menu overlay */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 left-4 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="p-2">
              <div className="flex items-center justify-between p-2 border-b border-border">
                <h3 className="font-medium text-foreground">Mehr</h3>
                <button
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-1 mt-2">
                {moreMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className="w-full flex items-center gap-3 p-3 text-left text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-border pt-1 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-left text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Abmelden</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-30">
        <div className="flex items-center px-2 py-2">
          {/* Main navigation items */}
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-h-[60px]",
                item.isActive && !item.isProminent
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 shrink-0",
                  item.isProminent ? "text-success" : ""
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium mt-1 leading-none",
                  item.isProminent ? "text-success font-semibold" : ""
                )}
              >
                {item.label}
              </span>
            </button>
          ))}

          {/* More button */}
          <button
            onClick={handleMoreClick}
            className={cn(
              "flex-1 flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-h-[60px]",
              isMoreActive || isMoreMenuOpen
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <MoreHorizontal className="h-5 w-5 shrink-0" />
            <span className="text-xs font-medium mt-1 leading-none">Mehr</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;