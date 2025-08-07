import { useState, useEffect, useCallback } from 'react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { usePostHog } from '@/contexts/PostHogProvider';
import { useAuth } from '@/hooks/useAuth';

interface ABTestConfig {
  name: string;
  variants: {
    control: any;
    variant_a?: any;
    variant_b?: any;
    variant_c?: any;
  };
  trafficAllocation?: number;
  conversionEvent?: string;
}

interface ABTestResult {
  variant: string;
  config: any;
  isControl: boolean;
  trackConversion: (conversionValue?: number, additionalProperties?: Record<string, any>) => void;
}

export const useABTest = (testName: string, config: ABTestConfig): ABTestResult => {
  const { isEnabled, trackFeatureUsage } = useFeatureFlags();
  const posthog = usePostHog();
  const { user } = useAuth();
  const [variant, setVariant] = useState<string>('control');
  const [testConfig, setTestConfig] = useState(config.variants.control);

  useEffect(() => {
    if (!user) return;

    // Check if this A/B test is enabled via feature flags
    const testFeatureFlag = `ab-test-${testName}`;
    const isTestEnabled = isEnabled(testFeatureFlag as any);

    if (!isTestEnabled) {
      setVariant('control');
      setTestConfig(config.variants.control);
      return;
    }

    // Get variant from PostHog
    const assignedVariant = posthog.getFeatureFlag(`ab-test-${testName}`);
    const variantString = typeof assignedVariant === 'string' ? assignedVariant : 'control';
    setVariant(variantString);

    // Set configuration based on variant
    const variantConfig = config.variants[variantString as keyof typeof config.variants] || config.variants.control;
    setTestConfig(variantConfig);

    // Track test exposure
    posthog.capture('ab_test_exposure', {
      test_name: testName,
      variant: variantString,
      user_id: user.id,
      timestamp: new Date().toISOString()
    });

    trackFeatureUsage(testFeatureFlag as any, 'test_exposed', {
      test_name: testName,
      variant: variantString
    });
  }, [testName, user, isEnabled, posthog, trackFeatureUsage, config.variants]);

  const trackConversion = useCallback((conversionValue?: number, additionalProperties?: Record<string, any>) => {
    if (!user) return;

    const conversionEvent = config.conversionEvent || `${testName}_conversion`;
    
    posthog.capture(conversionEvent, {
      test_name: testName,
      variant,
      conversion_value: conversionValue,
      user_id: user.id,
      timestamp: new Date().toISOString(),
      ...additionalProperties
    });

    // Also track generic A/B test conversion
    posthog.capture('ab_test_conversion', {
      test_name: testName,
      variant,
      conversion_event: conversionEvent,
      conversion_value: conversionValue,
      ...additionalProperties
    });
  }, [testName, variant, user, posthog, config.conversionEvent]);

  return {
    variant,
    config: testConfig,
    isControl: variant === 'control',
    trackConversion
  };
};

// Predefined A/B tests for common scenarios
export const useOrderFlowABTest = () => {
  return useABTest('order-flow-optimization', {
    name: 'Bestellprozess Optimierung',
    variants: {
      control: {
        showProgress: true,
        buttonText: 'Weiter',
        showPricing: 'step',
        uploadLayout: 'grid'
      },
      variant_a: {
        showProgress: true,
        buttonText: 'Jetzt fortfahren',
        showPricing: 'always',
        uploadLayout: 'grid'
      },
      variant_b: {
        showProgress: false,
        buttonText: 'Weiter',
        showPricing: 'always',
        uploadLayout: 'list'
      }
    },
    conversionEvent: 'order_completed'
  });
};

export const usePricingABTest = () => {
  return useABTest('pricing-display', {
    name: 'Preisdarstellung Test',
    variants: {
      control: {
        showDiscount: false,
        priceSize: 'normal',
        highlightSavings: false
      },
      variant_a: {
        showDiscount: true,
        priceSize: 'large',
        highlightSavings: true
      }
    },
    conversionEvent: 'package_selected'
  });
};

export const useCTAButtonABTest = () => {
  return useABTest('cta-button-optimization', {
    name: 'Call-to-Action Button Test',
    variants: {
      control: {
        text: 'Jetzt bestellen',
        color: 'primary',
        size: 'default'
      },
      variant_a: {
        text: 'Sofort bearbeiten lassen',
        color: 'secondary',
        size: 'lg'
      },
      variant_b: {
        text: 'Jetzt loslegen',
        color: 'primary',
        size: 'lg'
      }
    },
    conversionEvent: 'order_started'
  });
};