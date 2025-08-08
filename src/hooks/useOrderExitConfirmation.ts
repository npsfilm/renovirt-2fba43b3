import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrderStore } from '@/stores/orderStore';
import { useOrderMetaStore } from '@/stores/orderMetaStore';
import { useNavigationGuard } from '@/contexts/NavigationGuardContext';

interface UseOrderExitConfirmationReturn {
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  handleContinueOrder: () => void;
  handleExitOrder: () => void;
  hasOrderProgress: () => boolean;
}

export const useOrderExitConfirmation = (): UseOrderExitConfirmationReturn => {
  const location = useLocation();
  const { 
    showConfirmDialog, 
    setShowConfirmDialog, 
    confirmNavigation, 
    cancelNavigation, 
    setNavigationGuard 
  } = useNavigationGuard();
  
  // Order state
  const { photoType, files, package: orderPackage, extras, resetOrder } = useOrderStore();
  const { currentStep } = useOrderMetaStore();

  // Check if user has made meaningful progress
  const hasOrderProgress = useCallback(() => {
    return (
      photoType !== undefined ||
      files.length > 0 ||
      orderPackage !== undefined ||
      Object.values(extras).some(value => value === true)
    );
  }, [photoType, files.length, orderPackage, extras]);

  // Set up navigation guard when on order page with progress
  useEffect(() => {
    if (location.pathname === '/order') {
      const guard = (to: string) => {
        // Allow navigation if no progress or staying on order page
        if (!hasOrderProgress() || to === '/order') {
          return true;
        }
        // Block navigation if there's progress
        return false;
      };
      
      setNavigationGuard(guard);
      
      return () => {
        setNavigationGuard(null);
      };
    } else {
      setNavigationGuard(null);
    }
  }, [location.pathname, hasOrderProgress, setNavigationGuard]);

  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasOrderProgress() && location.pathname === '/order') {
        event.preventDefault();
        event.returnValue = 'Ihre Bestellung geht verloren. Sind Sie sicher?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasOrderProgress, location.pathname]);

  // Handle back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (hasOrderProgress() && location.pathname === '/order') {
        // Push state back to maintain order route
        window.history.pushState(null, '', '/order');
        setShowConfirmDialog(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasOrderProgress, location.pathname, setShowConfirmDialog]);

  const handleContinueOrder = () => {
    cancelNavigation();
  };

  const handleExitOrder = () => {
    resetOrder();
    confirmNavigation();
  };

  return {
    showConfirmDialog,
    setShowConfirmDialog,
    handleContinueOrder,
    handleExitOrder,
    hasOrderProgress,
  };
};