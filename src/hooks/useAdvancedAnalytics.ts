import { useEffect, useState, useCallback } from 'react';
import { usePostHog } from '@/contexts/PostHogProvider';
import { useAuth } from '@/hooks/useAuth';

interface CohortDefinition {
  name: string;
  description: string;
  conditions: CohortCondition[];
  type: 'behavioral' | 'demographic' | 'business';
}

interface CohortCondition {
  property: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value?: any;
  timeframe?: {
    amount: number;
    unit: 'days' | 'weeks' | 'months';
  };
}

interface UserCohorts {
  [cohortName: string]: boolean;
}

interface CohortAnalytics {
  cohortSize: number;
  conversionRate: number;
  avgOrderValue: number;
  retentionRate: number;
  lastUpdated: Date;
}

export const useAdvancedAnalytics = () => {
  const posthog = usePostHog();
  const { user } = useAuth();
  const [userCohorts, setUserCohorts] = useState<UserCohorts>({});
  const [cohortAnalytics, setCohortAnalytics] = useState<Record<string, CohortAnalytics>>({});

  // Predefined cohorts
  const predefinedCohorts: CohortDefinition[] = [
    {
      name: 'high_value_customers',
      description: 'Kunden mit hohem Bestellwert',
      type: 'business',
      conditions: [
        {
          property: 'total_order_value',
          operator: 'greater_than',
          value: 500
        }
      ]
    },
    {
      name: 'frequent_users',
      description: 'Häufige Nutzer (>5 Bestellungen)',
      type: 'behavioral',
      conditions: [
        {
          property: 'order_count',
          operator: 'greater_than',
          value: 5
        }
      ]
    },
    {
      name: 'mobile_users',
      description: 'Primär mobile Nutzer',
      type: 'demographic',
      conditions: [
        {
          property: 'primary_device',
          operator: 'equals',
          value: 'mobile'
        }
      ]
    },
    {
      name: 'help_seekers',
      description: 'Nutzer die oft Hilfe suchen',
      type: 'behavioral',
      conditions: [
        {
          property: 'help_interactions',
          operator: 'greater_than',
          value: 3,
          timeframe: { amount: 30, unit: 'days' }
        }
      ]
    },
    {
      name: 'drop_off_risk',
      description: 'Nutzer mit Abbruch-Risiko',
      type: 'behavioral',
      conditions: [
        {
          property: 'days_since_last_order',
          operator: 'greater_than',
          value: 90
        },
        {
          property: 'incomplete_orders',
          operator: 'greater_than',
          value: 2
        }
      ]
    },
    {
      name: 'new_customers',
      description: 'Neue Kunden (erste 30 Tage)',
      type: 'business',
      conditions: [
        {
          property: 'days_since_registration',
          operator: 'less_than',
          value: 30
        }
      ]
    }
  ];

  const calculateUserCohorts = useCallback(async () => {
    if (!user) return;

    // Mock cohort calculation - in real app this would query actual data
    const cohorts: UserCohorts = {};

    // This would be replaced with actual data queries
    const mockUserData = {
      total_order_value: 750,
      order_count: 8,
      primary_device: 'desktop',
      help_interactions: 2,
      days_since_last_order: 15,
      incomplete_orders: 1,
      days_since_registration: 45
    };

    predefinedCohorts.forEach(cohort => {
      const matchesAll = cohort.conditions.every(condition => {
        const userValue = mockUserData[condition.property as keyof typeof mockUserData];
        
        switch (condition.operator) {
          case 'equals':
            return userValue === condition.value;
          case 'not_equals':
            return userValue !== condition.value;
          case 'greater_than':
            return Number(userValue) > condition.value;
          case 'less_than':
            return Number(userValue) < condition.value;
          case 'contains':
            return String(userValue).includes(condition.value);
          case 'exists':
            return userValue !== undefined && userValue !== null;
          default:
            return false;
        }
      });

      cohorts[cohort.name] = matchesAll;
    });

    setUserCohorts(cohorts);

    // Track cohort membership
    posthog.capture('cohort_analysis', {
      user_id: user.id,
      cohorts: Object.entries(cohorts)
        .filter(([_, isMember]) => isMember)
        .map(([name]) => name),
      cohort_count: Object.values(cohorts).filter(Boolean).length,
      timestamp: new Date().toISOString()
    });

    return cohorts;
  }, [user, posthog]);

  const trackCohortEvent = useCallback((eventName: string, cohortName: string, properties: Record<string, any> = {}) => {
    posthog.capture(`cohort_${eventName}`, {
      cohort_name: cohortName,
      user_id: user?.id,
      ...properties,
      timestamp: new Date().toISOString()
    });
  }, [posthog, user]);

  const createCustomCohort = useCallback((definition: CohortDefinition) => {
    // Track custom cohort creation
    posthog.capture('custom_cohort_created', {
      cohort_name: definition.name,
      cohort_type: definition.type,
      conditions_count: definition.conditions.length,
      user_id: user?.id,
      timestamp: new Date().toISOString()
    });

    return definition;
  }, [posthog, user]);

  const generateCohortInsights = useCallback((cohortName: string) => {
    const insights = {
      conversionOpportunities: [],
      retentionRisks: [],
      upsellPotential: [],
      engagementRecommendations: []
    };

    // Generate insights based on cohort type
    if (cohortName === 'high_value_customers') {
      insights.upsellPotential.push('VIP-Service anbieten');
      insights.engagementRecommendations.push('Exklusive Angebote senden');
    }

    if (cohortName === 'drop_off_risk') {
      insights.retentionRisks.push('Reaktivierungskampagne starten');
      insights.conversionOpportunities.push('Spezielle Rabatte anbieten');
    }

    if (cohortName === 'new_customers') {
      insights.engagementRecommendations.push('Onboarding-E-Mail-Serie');
      insights.conversionOpportunities.push('Willkommensrabatt verlängern');
    }

    // Track insight generation
    posthog.capture('cohort_insights_generated', {
      cohort_name: cohortName,
      insights_count: Object.values(insights).flat().length,
      timestamp: new Date().toISOString()
    });

    return insights;
  }, [posthog]);

  const trackAdvancedFunnel = useCallback((funnelName: string, steps: string[], properties: Record<string, any> = {}) => {
    posthog.capture('advanced_funnel_step', {
      funnel_name: funnelName,
      funnel_steps: steps,
      current_step: steps.length - 1,
      user_cohorts: Object.entries(userCohorts)
        .filter(([_, isMember]) => isMember)
        .map(([name]) => name),
      ...properties,
      timestamp: new Date().toISOString()
    });
  }, [posthog, userCohorts]);

  useEffect(() => {
    if (user) {
      calculateUserCohorts();
    }
  }, [user, calculateUserCohorts]);

  return {
    userCohorts,
    predefinedCohorts,
    cohortAnalytics,
    calculateUserCohorts,
    trackCohortEvent,
    createCustomCohort,
    generateCohortInsights,
    trackAdvancedFunnel,
    isInCohort: (cohortName: string) => userCohorts[cohortName] || false,
    getUserCohortList: () => Object.entries(userCohorts)
      .filter(([_, isMember]) => isMember)
      .map(([name]) => name)
  };
};