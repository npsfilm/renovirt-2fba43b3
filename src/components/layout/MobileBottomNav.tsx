import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Upload, FileText, MoreHorizontal, User, Settings, LogOut, MessageSquare, HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useNavigationGuard } from '@/contexts/NavigationGuardContext';
import { cn } from '@/lib/utils';

const MobileBottomNav = () => {
  const isMobile = useIsMobile();
  const { navigate } = useNavigationGuard();
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  if (!isMobile) return null;

  const currentPath = location.pathname;

  const mainNavItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      isActive: currentPath === '/dashboard',
    },
    {
      id: 'orders',
      label: 'Bestellungen',
      icon: Package,
      path: '/orders',
      isActive: currentPath === '/orders',
    },
    {
      id: 'upload',
      label: 'Hochladen',
      icon: Upload,
      path: '/order',
      isActive: currentPath === '/order',
      isUploadCTA: true,
    },
    {
      id: 'billing',
      label: 'Rechnungen',
      icon: FileText,
      path: '/billing',
      isActive: currentPath === '/billing',
    },
  ];

  const moreMenuItems = [
    { id: 'profile', label: 'Profil', icon: User, path: '/profile' },
    { id: 'help', label: 'Hilfe', icon: HelpCircle, path: '/help' },
    { id: 'settings', label: 'Einstellungen', icon: Settings, path: '/settings' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/feedback' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const handleMoreClick = () => setIsMoreMenuOpen((v) => !v);

  const handleLogout = () => {
    signOut();
    setIsMoreMenuOpen(false);
  };

  const isMoreActive = ['/profile', '/help', '/settings', '/feedback'].includes(currentPath);

  return (
    <>
      {/* Overlay for more menu */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => setIsMoreMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* More menu overlay - Bottom Sheet Style */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-xl shadow-2xl z-50 overflow-hidden"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
          >
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3 mb-4" />

            <div className="px-4 pb-2">
              <div className="space-y-1">
                {moreMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    aria-label={item.label}
                    type="button"
                    className="w-full flex items-center gap-4 p-4 text-left text-foreground active:scale-95 transition-transform"
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}

                <div className="border-t border-border pt-2 mt-3">
                  <button
                    onClick={handleLogout}
                    aria-label="Abmelden"
                    type="button"
                    className="w-full flex items-center gap-4 p-4 text-left text-destructive active:scale-95 transition-transform"
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

      {/* Bottom Navigation Bar - Edge-to-edge */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40"
        role="navigation"
        aria-label="Hauptnavigation mobil"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch px-1 py-2 h-16">
          {/* Main navigation items */}
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              aria-label={item.label}
              type="button"
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all duration-150 min-h-[44px]',
                item.isUploadCTA 
                  ? 'text-primary-foreground' 
                  : item.isActive 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
              )}
            >
              <div className={cn(
                "flex items-center justify-center",
                item.isUploadCTA ? "h-8 w-8 rounded-full bg-primary" : "h-5"
              )}>
                <item.icon className={cn(
                  item.isUploadCTA ? "h-4 w-4" : "h-[18px] w-[18px]"
                )} />
              </div>
              <span
                className={cn(
                  'text-[10px] leading-tight text-center',
                  item.isUploadCTA
                    ? 'font-medium text-primary'
                    : item.isActive 
                      ? 'font-medium text-foreground' 
                      : 'font-normal text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </button>
          ))}

          {/* More button */}
          <button
            onClick={handleMoreClick}
            aria-label="Mehr"
            type="button"
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all duration-150 min-h-[44px]',
              isMoreActive || isMoreMenuOpen ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <div className="flex items-center justify-center h-5">
              <MoreHorizontal className="h-[18px] w-[18px]" />
            </div>
            <span
              className={cn(
                'text-[10px] leading-tight text-center',
                isMoreActive || isMoreMenuOpen ? 'font-medium text-foreground' : 'font-normal text-muted-foreground'
              )}
            >
              Mehr
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;
