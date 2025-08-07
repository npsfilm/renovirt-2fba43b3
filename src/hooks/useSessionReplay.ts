import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@/contexts/PostHogProvider';
import { useAuth } from '@/hooks/useAuth';

interface SessionReplayOptions {
  captureConsole?: boolean;
  captureNetwork?: boolean;
  recordCrossOriginIframes?: boolean;
}

export const useSessionReplay = (options: SessionReplayOptions = {}) => {
  const posthog = usePostHog();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Enhanced session replay for critical user flows
    const isCriticalFlow = [
      '/order',
      '/admin',
      '/help'
    ].some(path => location.pathname.startsWith(path));

    if (isCriticalFlow && user) {
      // Start session recording for critical flows
      posthog.startSessionRecording();

      // Tag the session with metadata
      posthog.capture('session_replay_started', {
        flow_type: location.pathname.split('/')[1] || 'unknown',
        user_type: user.user_metadata?.role || 'customer',
        critical_flow: true,
        session_id: posthog.get_session_id()
      });
    }
  }, [location.pathname, posthog, user, options]);

  const tagSession = (tag: string, properties: Record<string, any> = {}) => {
    posthog.capture('session_tagged', {
      tag,
      session_id: posthog.get_session_id(),
      timestamp: new Date().toISOString(),
      ...properties
    });
  };

  const captureUserAction = (action: string, element?: string, properties: Record<string, any> = {}) => {
    posthog.capture('user_action_captured', {
      action,
      element,
      page: location.pathname,
      session_id: posthog.get_session_id(),
      timestamp: new Date().toISOString(),
      ...properties
    });
  };

  const markConversionEvent = (event: string, value?: number) => {
    posthog.capture('conversion_event', {
      conversion_type: event,
      conversion_value: value,
      session_id: posthog.get_session_id(),
      page: location.pathname,
      timestamp: new Date().toISOString()
    });
  };

  const stopSessionRecording = () => {
    posthog.stopSessionRecording();
    posthog.capture('session_replay_stopped', {
      session_id: posthog.get_session_id(),
      stop_reason: 'manual'
    });
  };

  return {
    tagSession,
    captureUserAction,
    markConversionEvent,
    stopSessionRecording
  };
};