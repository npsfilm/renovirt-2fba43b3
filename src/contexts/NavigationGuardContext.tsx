import React, { createContext, useContext, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationGuardContextType {
  navigate: (to: string) => void;
  setNavigationGuard: (guard: ((to: string) => boolean) | null) => void;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  pendingNavigation: string | null;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextType | null>(null);

export const useNavigationGuard = () => {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    throw new Error('useNavigationGuard must be used within NavigationGuardProvider');
  }
  return context;
};

interface NavigationGuardProviderProps {
  children: React.ReactNode;
}

export const NavigationGuardProvider: React.FC<NavigationGuardProviderProps> = ({ children }) => {
  const reactNavigate = useNavigate();
  const location = useLocation();
  const [navigationGuard, setNavigationGuard] = useState<((to: string) => boolean) | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const navigate = useCallback((to: string) => {
    // If we're navigating to the same route, allow it
    if (to === location.pathname) {
      return;
    }

    // If there's a guard and it returns false, show confirmation
    if (navigationGuard && !navigationGuard(to)) {
      setPendingNavigation(to);
      setShowConfirmDialog(true);
      return;
    }

    // Otherwise, navigate normally
    reactNavigate(to);
  }, [reactNavigate, location.pathname, navigationGuard]);

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      reactNavigate(pendingNavigation);
    }
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  }, [reactNavigate, pendingNavigation]);

  const cancelNavigation = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  }, []);

  const value: NavigationGuardContextType = {
    navigate,
    setNavigationGuard,
    showConfirmDialog,
    setShowConfirmDialog,
    pendingNavigation,
    confirmNavigation,
    cancelNavigation,
  };

  return (
    <NavigationGuardContext.Provider value={value}>
      {children}
    </NavigationGuardContext.Provider>
  );
};
