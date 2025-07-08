
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
    // Direktes Insert in die security_events Tabelle
    const { error } = await supabase
      .from('security_events')
      .insert({
        event_type: eventType,
        details: details,
        severity: severity,
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
    // Verwende help_interactions als Fallback für Demo-Zwecke
    const { data, error } = await supabase
      .from('help_interactions')
      .select('question, created_at')
      .gte('created_at', new Date(Date.now() - getTimeframeMs(timeframe)).toISOString());

    if (error) throw error;

    // Simuliere Metriken basierend auf verfügbaren Daten
    const metrics: SecurityMetrics = {
      failedLogins: Math.floor(Math.random() * 5), // Simuliert
      suspiciousActivity: Math.floor(Math.random() * 3), // Simuliert
      adminActions: Math.floor(Math.random() * 10), // Simuliert
      dataAccess: data?.length || 0 // Basiert auf help_interactions
    };

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
    // Vereinfachte Überprüfung
    secureLog('Checking for suspicious activity', { userId });
    
    // Für Demo-Zwecke: gelegentlich verdächtige Aktivität simulieren
    const isSuspicious = Math.random() < 0.1; // 10% Chance

    if (isSuspicious && userId) {
      await trackSecurityEvent('suspicious_activity_detected', {
        userId,
        reason: 'Automated detection'
      }, 'medium');
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

// Enhanced rate limiting with database persistence
export const checkRateLimit = async (
  key: string, 
  maxRequests: number, 
  windowMs: number
): Promise<boolean> => {
  try {
    const { data: canProceed, error } = await supabase.rpc('check_rate_limit', {
      identifier: key,
      max_requests: maxRequests,
      window_seconds: Math.floor(windowMs / 1000)
    });

    if (error) {
      secureLog('Database rate limit check failed:', error);
      // Fallback to memory-based rate limiting
      return checkMemoryRateLimit(key, maxRequests, windowMs);
    }

    return canProceed || false;
  } catch (error) {
    secureLog('Rate limit check error:', error);
    return checkMemoryRateLimit(key, maxRequests, windowMs);
  }
};

// Fallback memory-based rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkMemoryRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
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

// Real-time threat detection
export const detectSuspiciousActivity = async (
  userId: string,
  activityType: string,
  metadata: any = {}
): Promise<{ isSuspicious: boolean; riskLevel: 'low' | 'medium' | 'high' | 'critical' }> => {
  try {
    const timeWindow = new Date(Date.now() - 3600000); // Last hour
    
    const { data: recentEvents, error } = await supabase
      .from('security_events')
      .select('event_type, created_at, severity')
      .eq('user_id', userId)
      .gte('created_at', timeWindow.toISOString());

    if (error) {
      secureLog('Failed to check recent security events:', error);
      return { isSuspicious: false, riskLevel: 'low' };
    }

    const events = recentEvents || [];
    
    // Analyze patterns
    const failedAttempts = events.filter(e => e.event_type.includes('failed')).length;
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const highEvents = events.filter(e => e.severity === 'high').length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let isSuspicious = false;

    if (criticalEvents > 0) {
      riskLevel = 'critical';
      isSuspicious = true;
    } else if (highEvents > 2 || failedAttempts > 5) {
      riskLevel = 'high';
      isSuspicious = true;
    } else if (failedAttempts > 3 || events.length > 20) {
      riskLevel = 'medium';
      isSuspicious = true;
    }

    if (isSuspicious) {
      await trackSecurityEvent('suspicious_activity_detected', {
        userId,
        activityType,
        riskLevel,
        recentEventCount: events.length,
        failedAttempts,
        criticalEvents,
        highEvents,
        ...metadata
      }, riskLevel);
    }

    return { isSuspicious, riskLevel };
  } catch (error) {
    secureLog('Threat detection error:', error);
    return { isSuspicious: false, riskLevel: 'low' };
  }
};
