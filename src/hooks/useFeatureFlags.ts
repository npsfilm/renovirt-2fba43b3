import { useState, useEffect } from 'react';
import { usePostHog } from '@/contexts/PostHogProvider';
import { useAuth } from '@/hooks/useAuth';

interface FeatureFlags {
  'enhanced-order-flow': boolean;
  'ai-chat-improvements': boolean;
  'admin-bulk-actions': boolean;
  'mobile-optimization': boolean;
  'payment-methods-v2': boolean;
  'dark-mode-toggle': boolean;
  'order-analytics': boolean;
  'help-system-v2': boolean;
}

export const useFeatureFlags = () => {
  const posthog = usePostHog();
  const { user } = useAuth();
  const [flags, setFlags] = useState<Partial<FeatureFlags>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Load feature flags from PostHog
    const loadFlags = async () => {
      try {
        // Wait for PostHog to be ready
        await posthog.isFeatureEnabled('enhanced-order-flow'); // This ensures flags are loaded
        
        const featureFlags: Partial<FeatureFlags> = {
          'enhanced-order-flow': posthog.isFeatureEnabled('enhanced-order-flow'),
          'ai-chat-improvements': posthog.isFeatureEnabled('ai-chat-improvements'),
          'admin-bulk-actions': posthog.isFeatureEnabled('admin-bulk-actions'),
          'mobile-optimization': posthog.isFeatureEnabled('mobile-optimization'),
          'payment-methods-v2': posthog.isFeatureEnabled('payment-methods-v2'),
          'dark-mode-toggle': posthog.isFeatureEnabled('dark-mode-toggle'),
          'order-analytics': posthog.isFeatureEnabled('order-analytics'),
          'help-system-v2': posthog.isFeatureEnabled('help-system-v2'),
        };

        setFlags(featureFlags);
        
        // Track feature flag exposure
        Object.entries(featureFlags).forEach(([flag, enabled]) => {
          if (enabled) {
            posthog.capture('feature_flag_called', {
              flag_name: flag,
              flag_enabled: enabled,
              user_id: user.id,
              user_type: user.user_metadata?.role || 'customer'
            });
          }
        });
      } catch (error) {
        console.error('Error loading feature flags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlags();

    // Listen for feature flag updates
    const handleFlagUpdate = () => {
      loadFlags();
    };

    posthog.onFeatureFlags?.(handleFlagUpdate);

    return () => {
      // Cleanup if PostHog provides a cleanup method
    };
  }, [posthog, user]);

  const isEnabled = (flagName: keyof FeatureFlags): boolean => {
    return flags[flagName] || false;
  };

  const trackFeatureUsage = (flagName: keyof FeatureFlags, action: string, properties: Record<string, any> = {}) => {
    posthog.capture('feature_used', {
      feature_flag: flagName,
      action,
      user_id: user?.id,
      user_type: user?.user_metadata?.role || 'customer',
      ...properties
    });
  };

  return {
    flags,
    isEnabled,
    isLoading,
    trackFeatureUsage
  };
};