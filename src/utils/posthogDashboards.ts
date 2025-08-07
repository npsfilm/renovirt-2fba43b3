import { usePostHog } from '@/contexts/PostHogProvider';

export interface DashboardConfig {
  name: string;
  description: string;
  filters?: Record<string, any>;
  insights: InsightConfig[];
}

export interface InsightConfig {
  name: string;
  type: 'trend' | 'funnel' | 'retention' | 'stickiness' | 'lifecycle';
  events?: string[];
  properties?: Record<string, any>;
  breakdown?: string;
  interval?: 'hour' | 'day' | 'week' | 'month';
}

export const createOrderFunnelDashboard = (): DashboardConfig => ({
  name: 'Bestellprozess Funnel',
  description: 'Analyse des kompletten Bestellprozesses von Auswahl bis Zahlung',
  insights: [
    {
      name: 'Bestellprozess Funnel',
      type: 'funnel',
      events: [
        'photo_type_selected',
        'files_uploaded', 
        'package_selected',
        'order_summary_viewed',
        'order_submitted',
        'payment_completed'
      ]
    },
    {
      name: 'Tägliche Bestellungen',
      type: 'trend',
      events: ['order_submitted'],
      interval: 'day'
    },
    {
      name: 'Upload-Erfolgsrate',
      type: 'trend',
      events: ['file_upload_completed', 'file_upload_failed'],
      interval: 'day'
    },
    {
      name: 'Zahlungsmethoden',
      type: 'trend',
      events: ['payment_method_selected'],
      breakdown: 'payment_method'
    }
  ]
});

export const createHelpSystemDashboard = (): DashboardConfig => ({
  name: 'Hilfe-System Analytics',
  description: 'Performance und Nutzung des AI-Hilfe-Systems',
  insights: [
    {
      name: 'Hilfe-Interaktionen',
      type: 'trend',
      events: ['help_chat_started', 'help_search_performed'],
      interval: 'day'
    },
    {
      name: 'AI-Chat Funnel',
      type: 'funnel',
      events: [
        'help_chat_started',
        'help_message_sent',
        'help_response_rated'
      ]
    },
    {
      name: 'Häufigste Suchbegriffe',
      type: 'trend',
      events: ['help_search_performed'],
      breakdown: 'search_query'
    },
    {
      name: 'Bewertungen Verteilung',
      type: 'trend',
      events: ['help_response_rated'],
      breakdown: 'rating'
    }
  ]
});

export const createAdminDashboard = (): DashboardConfig => ({
  name: 'Admin Performance',
  description: 'Admin-Aktivitäten und Workflow-Effizienz',
  insights: [
    {
      name: 'Admin-Aktivitäten',
      type: 'trend',
      events: ['admin_action'],
      breakdown: 'action',
      interval: 'day'
    },
    {
      name: 'Bestellstatus-Änderungen',
      type: 'trend',
      events: ['admin_action'],
      properties: { action: 'order_management' },
      breakdown: 'order_action'
    },
    {
      name: 'Bulk-Aktionen',
      type: 'trend',
      events: ['admin_action'],
      properties: { action: 'bulk_action' },
      breakdown: 'bulk_action'
    },
    {
      name: 'Export-Aktivitäten',
      type: 'trend',
      events: ['admin_action'],
      properties: { action: 'data_exported' },
      breakdown: 'export_type'
    }
  ]
});

export const createBusinessMetricsDashboard = (): DashboardConfig => ({
  name: 'Business KPIs',
  description: 'Wichtige Geschäftskennzahlen und Trends',
  insights: [
    {
      name: 'Konversionsrate',
      type: 'trend',
      events: ['page_viewed', 'order_submitted'],
      interval: 'day'
    },
    {
      name: 'Nutzer-Retention',
      type: 'retention',
      events: ['page_viewed']
    },
    {
      name: 'Feature-Nutzung',
      type: 'trend',
      events: ['feature_used'],
      breakdown: 'feature_flag'
    },
    {
      name: 'Mobile vs Desktop',
      type: 'trend',
      events: ['page_viewed'],
      breakdown: 'device_type'
    }
  ]
});

export const useDashboardCreator = () => {
  const posthog = usePostHog();

  const createDashboard = async (config: DashboardConfig) => {
    try {
      // Log dashboard creation for tracking
      posthog.capture('dashboard_created', {
        dashboard_name: config.name,
        insight_count: config.insights.length,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        message: `Dashboard "${config.name}" Konfiguration erstellt`,
        config
      };
    } catch (error) {
      console.error('Dashboard creation error:', error);
      return {
        success: false,
        message: 'Fehler beim Erstellen des Dashboards',
        error
      };
    }
  };

  const setupAllDashboards = async () => {
    const dashboards = [
      createOrderFunnelDashboard(),
      createHelpSystemDashboard(),
      createAdminDashboard(),
      createBusinessMetricsDashboard()
    ];

    const results = await Promise.all(
      dashboards.map(dashboard => createDashboard(dashboard))
    );

    posthog.capture('all_dashboards_setup', {
      dashboard_count: dashboards.length,
      success_count: results.filter(r => r.success).length
    });

    return results;
  };

  return {
    createDashboard,
    setupAllDashboards,
    predefinedDashboards: {
      orderFunnel: createOrderFunnelDashboard(),
      helpSystem: createHelpSystemDashboard(),
      admin: createAdminDashboard(),
      businessMetrics: createBusinessMetricsDashboard()
    }
  };
};