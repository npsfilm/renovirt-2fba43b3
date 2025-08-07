
import React from 'react';
import { useLocation } from 'react-router-dom';
import AIChatWidget from '@/components/help/AIChatWidget';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

const GlobalAIWidget = () => {
  const location = useLocation();
  const { isEnabled, trackFeatureUsage } = useFeatureFlags();
  
  // Zeige das Widget auf den meisten Seiten, aber nicht auf Login/Register
  const hideWidget = ['/auth', '/admin-auth', '/onboarding'].some(path => 
    location.pathname.startsWith(path)
  );

  // Feature flag für AI Chat Verbesserungen
  const useEnhancedChat = isEnabled('ai-chat-improvements');

  if (hideWidget) {
    return null;
  }

  // Track feature flag usage
  if (useEnhancedChat) {
    trackFeatureUsage('ai-chat-improvements', 'widget_displayed', {
      page: location.pathname
    });
  }

  return <AIChatWidget />;
};

export default GlobalAIWidget;
