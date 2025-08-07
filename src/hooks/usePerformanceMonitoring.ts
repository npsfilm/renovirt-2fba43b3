import { useEffect, useState, useCallback } from 'react';
import { usePostHog } from '@/contexts/PostHogProvider';
import { useLocation } from 'react-router-dom';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
}

interface PerformanceAlert {
  type: 'warning' | 'critical';
  message: string;
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
}

const PERFORMANCE_THRESHOLDS = {
  pageLoadTime: { warning: 3000, critical: 5000 },
  firstContentfulPaint: { warning: 2000, critical: 3000 },
  largestContentfulPaint: { warning: 2500, critical: 4000 },
  firstInputDelay: { warning: 100, critical: 300 },
  cumulativeLayoutShift: { warning: 0.1, critical: 0.25 },
  totalBlockingTime: { warning: 300, critical: 600 }
};

export const usePerformanceMonitoring = () => {
  const posthog = usePostHog();
  const location = useLocation();
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const calculateWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const metrics: Partial<PerformanceMetrics> = {};

    // Basic timing metrics
    if (navigation) {
      metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }

    // Paint metrics
    paint.forEach((entry) => {
      if (entry.name === 'first-paint') {
        metrics.firstPaint = entry.startTime;
      }
      if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    });

    // Web Vitals (if available)
    if ('PerformanceObserver' in window) {
      // LCP - Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.largestContentfulPaint = lastEntry.startTime;
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.firstInputDelay = entry.processingStart - entry.startTime;
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.cumulativeLayoutShift = clsValue;
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS not supported
      }
    }

    return metrics;
  }, []);

  const checkPerformanceAlerts = useCallback((metrics: Partial<PerformanceMetrics>) => {
    const newAlerts: PerformanceAlert[] = [];

    Object.entries(metrics).forEach(([key, value]) => {
      const metricKey = key as keyof PerformanceMetrics;
      const thresholds = PERFORMANCE_THRESHOLDS[metricKey];
      
      if (thresholds && typeof value === 'number') {
        if (value > thresholds.critical) {
          newAlerts.push({
            type: 'critical',
            message: `Kritische Performance: ${key} ist ${value.toFixed(0)}ms (Limit: ${thresholds.critical}ms)`,
            metric: metricKey,
            value,
            threshold: thresholds.critical
          });
        } else if (value > thresholds.warning) {
          newAlerts.push({
            type: 'warning',
            message: `Performance Warnung: ${key} ist ${value.toFixed(0)}ms (Empfohlen: <${thresholds.warning}ms)`,
            metric: metricKey,
            value,
            threshold: thresholds.warning
          });
        }
      }
    });

    setAlerts(newAlerts);
    return newAlerts;
  }, []);

  const trackPerformanceMetrics = useCallback((metrics: Partial<PerformanceMetrics>) => {
    // Track to PostHog
    posthog.capture('page_performance_detailed', {
      page: location.pathname,
      ...metrics,
      user_agent: navigator.userAgent,
      connection_type: (navigator as any).connection?.effectiveType,
      device_memory: (navigator as any).deviceMemory,
      timestamp: new Date().toISOString()
    });

    // Track alerts separately
    const alerts = checkPerformanceAlerts(metrics);
    if (alerts.length > 0) {
      posthog.capture('performance_alert', {
        page: location.pathname,
        alerts: alerts.map(alert => ({
          type: alert.type,
          metric: alert.metric,
          value: alert.value,
          threshold: alert.threshold
        })),
        critical_count: alerts.filter(a => a.type === 'critical').length,
        warning_count: alerts.filter(a => a.type === 'warning').length
      });
    }
  }, [posthog, location.pathname, checkPerformanceAlerts]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);

    // Initial metrics collection
    setTimeout(() => {
      const initialMetrics = calculateWebVitals();
      if (initialMetrics) {
        setMetrics(initialMetrics);
        trackPerformanceMetrics(initialMetrics);
      }
    }, 1000);

    // Monitor page interactions
    const measurePageInteraction = () => {
      const updatedMetrics = calculateWebVitals();
      if (updatedMetrics) {
        setMetrics(prev => ({ ...prev, ...updatedMetrics }));
        trackPerformanceMetrics(updatedMetrics);
      }
    };

    // Measure after key interactions
    document.addEventListener('click', measurePageInteraction);
    window.addEventListener('beforeunload', measurePageInteraction);

    return () => {
      document.removeEventListener('click', measurePageInteraction);
      window.removeEventListener('beforeunload', measurePageInteraction);
    };
  }, [calculateWebVitals, trackPerformanceMetrics]);

  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [location.pathname, startMonitoring]);

  const getPerformanceScore = () => {
    if (!metrics.pageLoadTime) return null;

    let score = 100;
    
    // Deduct points for poor metrics
    Object.entries(metrics).forEach(([key, value]) => {
      const metricKey = key as keyof PerformanceMetrics;
      const thresholds = PERFORMANCE_THRESHOLDS[metricKey];
      
      if (thresholds && typeof value === 'number') {
        if (value > thresholds.critical) {
          score -= 20;
        } else if (value > thresholds.warning) {
          score -= 10;
        }
      }
    });

    return Math.max(0, score);
  };

  const getPerformanceGrade = () => {
    const score = getPerformanceScore();
    if (score === null) return 'N/A';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return {
    metrics,
    alerts,
    isMonitoring,
    performanceScore: getPerformanceScore(),
    performanceGrade: getPerformanceGrade(),
    trackCustomMetric: (name: string, value: number, unit: string = 'ms') => {
      posthog.capture('custom_performance_metric', {
        metric_name: name,
        metric_value: value,
        metric_unit: unit,
        page: location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  };
};