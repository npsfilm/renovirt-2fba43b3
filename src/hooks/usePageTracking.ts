import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@/contexts/PostHogProvider';
import { useAuth } from '@/hooks/useAuth';

export const usePageTracking = () => {
  const location = useLocation();
  const posthog = usePostHog();
  const { user } = useAuth();
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Track page view with enhanced properties
    const trackPageView = () => {
      const currentTime = Date.now();
      const timeOnPreviousPage = currentTime - startTime.current;
      startTime.current = currentTime;

      // Determine page type and user context
      const pathname = location.pathname;
      const isAdminPage = pathname.startsWith('/admin');
      const isAuthPage = pathname.startsWith('/auth') || pathname === '/';
      const isOrderPage = pathname.startsWith('/order');
      const isDashboardPage = pathname.startsWith('/dashboard');
      
      // Create meaningful page name
      let pageName = pathname;
      if (pathname === '/') pageName = 'Landing Page';
      else if (pathname === '/auth') pageName = 'Authentication';
      else if (pathname === '/dashboard') pageName = 'Dashboard';
      else if (pathname === '/order') pageName = 'Order Creation';
      else if (pathname === '/orders') pageName = 'Orders Overview';
      else if (pathname === '/help') pageName = 'Help Center';
      else if (pathname === '/profile') pageName = 'User Profile';
      else if (pathname.startsWith('/admin/dashboard')) pageName = 'Admin Dashboard';
      else if (pathname.startsWith('/admin/orders')) pageName = 'Admin Orders';
      else if (pathname.startsWith('/admin/analytics')) pageName = 'Admin Analytics';

      // Track with PostHog
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        page_name: pageName,
        page_type: isAdminPage ? 'admin' : isAuthPage ? 'auth' : isOrderPage ? 'order' : isDashboardPage ? 'dashboard' : 'other',
        user_type: user ? (isAdminPage ? 'admin' : 'authenticated') : 'anonymous',
        time_on_previous_page: timeOnPreviousPage,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      });

      // Track navigation pattern
      posthog.capture('page_navigation', {
        from_page: document.referrer ? 'external' : 'internal',
        to_page: pageName,
        navigation_type: performance?.navigation?.type || 'unknown'
      });
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(trackPageView, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, posthog, user]);

  // Track page performance
  useEffect(() => {
    const trackPerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          posthog.capture('page_performance', {
            page_load_time: navigation.loadEventEnd - navigation.fetchStart,
            dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            first_paint: navigation.responseStart - navigation.fetchStart,
            page_name: location.pathname
          });
        }
      }
    };

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }
  }, [location.pathname, posthog]);
};