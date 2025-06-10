
import { supabase } from '@/integrations/supabase/client';
import { secureLog, logSecurityEvent } from './secureLogging';

interface SecurityMetrics {
  failedLogins: number;
  suspiciousActivity: number;
  adminActions: number;
  dataAccess: number;
}

export const trackSecurityEvent = async (
  eventType: string, 
  details: any = {},
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
) => {
  try {
    const { error } = await supabase
      .from('security_events')
      .insert({
        event_type: eventType,
        details,
        severity,
        ip_address: await getUserIP(),
        user_agent: navigator.userAgent
      });

    if (error) {
      secureLog('Failed to track security event:', error);
    }

    // Log lokale Sicherheitsereignisse
    logSecurityEvent(eventType, details);
  } catch (error) {
    secureLog('Security tracking error:', error);
  }
};

export const getSecurityMetrics = async (timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<SecurityMetrics> => {
  try {
    const timeMap = {
      hour: '1 hour',
      day: '1 day', 
      week: '1 week'
    };

    const { data, error } = await supabase
      .from('security_events')
      .select('event_type, severity, created_at')
      .gte('created_at', new Date(Date.now() - getTimeframeMs(timeframe)).toISOString());

    if (error) throw error;

    const metrics: SecurityMetrics = {
      failedLogins: 0,
      suspiciousActivity: 0,
      adminActions: 0,
      dataAccess: 0
    };

    data?.forEach(event => {
      switch (event.event_type) {
        case 'failed_login':
        case 'invalid_credentials':
          metrics.failedLogins++;
          break;
        case 'admin_login':
        case 'admin_action':
          metrics.adminActions++;
          break;
        case 'data_access':
        case 'file_download':
          metrics.dataAccess++;
          break;
        default:
          if (event.severity === 'high' || event.severity === 'critical') {
            metrics.suspiciousActivity++;
          }
      }
    });

    return metrics;
  } catch (error) {
    secureLog('Failed to get security metrics:', error);
    return {
      failedLogins: 0,
      suspiciousActivity: 0,
      adminActions: 0,
      dataAccess: 0
    };
  }
};

export const checkForSuspiciousActivity = async (userId?: string) => {
  try {
    // Prüfe auf ungewöhnliche Aktivitätsmuster
    const recentEvents = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Letzte Stunde
      .order('created_at', { ascending: false });

    if (recentEvents.error) return false;

    const events = recentEvents.data || [];
    
    // Verdächtige Muster erkennen
    const failedLogins = events.filter(e => e.event_type === 'failed_login').length;
    const rapidRequests = events.length > 50; // Mehr als 50 Ereignisse in einer Stunde
    const multipleIPs = new Set(events.map(e => e.ip_address)).size > 3;

    const isSuspicious = failedLogins > 5 || rapidRequests || multipleIPs;

    if (isSuspicious) {
      await trackSecurityEvent('suspicious_activity_detected', {
        userId,
        failedLogins,
        totalEvents: events.length,
        uniqueIPs: new Set(events.map(e => e.ip_address)).size
      }, 'high');
    }

    return isSuspicious;
  } catch (error) {
    secureLog('Suspicious activity check failed:', error);
    return false;
  }
};

const getUserIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
};

const getTimeframeMs = (timeframe: 'hour' | 'day' | 'week'): number => {
  const timeMap = {
    hour: 3600000,     // 1 Stunde
    day: 86400000,     // 1 Tag
    week: 604800000    // 1 Woche
  };
  return timeMap[timeframe];
};

// Rate Limiting für kritische Aktionen
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    trackSecurityEvent('rate_limit_exceeded', { key, maxRequests, windowMs }, 'medium');
    return false;
  }

  record.count++;
  return true;
};
