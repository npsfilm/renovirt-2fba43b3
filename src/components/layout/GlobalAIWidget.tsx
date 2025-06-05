
import React from 'react';
import { useLocation } from 'react-router-dom';
import AIChatWidget from '@/components/help/AIChatWidget';

const GlobalAIWidget = () => {
  const location = useLocation();
  
  // Zeige das Widget auf den meisten Seiten, aber nicht auf Login/Register
  const hideWidget = ['/auth', '/admin-auth', '/onboarding'].some(path => 
    location.pathname.startsWith(path)
  );

  if (hideWidget) {
    return null;
  }

  return <AIChatWidget />;
};

export default GlobalAIWidget;
