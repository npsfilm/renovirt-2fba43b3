import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@/contexts/PostHogProvider';
import { useAuth } from '@/hooks/useAuth';

export const useAdminTracking = () => {
  const location = useLocation();
  const posthog = usePostHog();
  const { user } = useAuth();

  useEffect(() => {
    // Track admin page views with enhanced context
    if (location.pathname.startsWith('/admin')) {
      const adminPageType = location.pathname.split('/')[2] || 'dashboard';
      
      posthog.capture('admin_page_viewed', {
        page_type: adminPageType,
        full_path: location.pathname,
        admin_user_id: user?.id,
        admin_email: user?.email,
        timestamp: new Date().toISOString()
      });
    }
  }, [location.pathname, posthog, user]);

  // Admin action tracking functions
  const trackAdminAction = (action: string, details: Record<string, any> = {}) => {
    posthog.capture('admin_action', {
      action,
      admin_user_id: user?.id,
      admin_email: user?.email,
      page: location.pathname,
      timestamp: new Date().toISOString(),
      ...details
    });
  };

  const trackOrderAction = (orderId: string, action: string, details: Record<string, any> = {}) => {
    trackAdminAction('order_management', {
      order_id: orderId,
      order_action: action,
      ...details
    });
  };

  const trackCustomerAction = (customerId: string, action: string, details: Record<string, any> = {}) => {
    trackAdminAction('customer_management', {
      customer_id: customerId,
      customer_action: action,
      ...details
    });
  };

  const trackAnalyticsViewed = (analyticsType: string, filters: Record<string, any> = {}) => {
    trackAdminAction('analytics_viewed', {
      analytics_type: analyticsType,
      filters,
      view_duration: Date.now()
    });
  };

  const trackBulkAction = (action: string, itemCount: number, details: Record<string, any> = {}) => {
    trackAdminAction('bulk_action', {
      bulk_action: action,
      item_count: itemCount,
      ...details
    });
  };

  const trackSettingsChange = (settingType: string, oldValue: any, newValue: any) => {
    trackAdminAction('settings_changed', {
      setting_type: settingType,
      old_value: oldValue,
      new_value: newValue
    });
  };

  const trackExportAction = (exportType: string, itemCount: number, format: string) => {
    trackAdminAction('data_exported', {
      export_type: exportType,
      item_count: itemCount,
      export_format: format
    });
  };

  const trackSearchAction = (searchType: string, query: string, resultCount: number) => {
    trackAdminAction('search_performed', {
      search_type: searchType,
      search_query: query,
      result_count: resultCount
    });
  };

  return {
    trackAdminAction,
    trackOrderAction,
    trackCustomerAction,
    trackAnalyticsViewed,
    trackBulkAction,
    trackSettingsChange,
    trackExportAction,
    trackSearchAction
  };
};