import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrderStore } from '@/stores/orderStore';
import { useOrderMetaStore } from '@/stores/orderMetaStore';

interface UseOrderExitConfirmationReturn {
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  handleContinueOrder: () => void;
  handleExitOrder: () => void;
  hasOrderProgress: () => boolean;
}

export const useOrderExitConfirmation = (): UseOrderExitConfirmationReturn => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Handle programmatic navigation attempts
  useEffect(() => {
    const originalNavigate = navigate;
    
    // Override navigate function to intercept navigation
    const interceptNavigate = (to: string | number, options?: any) => {
      if (typeof to === 'string' && to !== '/order' && hasOrderProgress() && location.pathname === '/order') {
        setPendingNavigation(to);
        setShowConfirmDialog(true);
        return;
      }
      
      // Allow navigation if no progress or not on order page
      if (typeof to === 'string') {
        originalNavigate(to, options);
      } else {
        originalNavigate(to);
      }
    };

    // Store original navigate for cleanup
    (window as any).__originalNavigate = originalNavigate;
    
    return () => {
      // Cleanup if needed
    };
  }, [navigate, hasOrderProgress, location.pathname]);

  // Handle back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (hasOrderProgress() && location.pathname === '/order') {
        event.preventDefault();
        window.history.pushState(null, '', '/order');
        setShowConfirmDialog(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasOrderProgress, location.pathname]);

  const handleContinueOrder = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  };

  const handleExitOrder = () => {
    resetOrder();
    setShowConfirmDialog(false);
    
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    } else {
      navigate('/dashboard');
    }
  };

  return {
    showConfirmDialog,
    setShowConfirmDialog,
    handleContinueOrder,
    handleExitOrder,
    hasOrderProgress,
  };
};