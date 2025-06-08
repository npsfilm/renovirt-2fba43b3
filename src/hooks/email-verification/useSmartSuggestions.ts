
import { useState, useCallback } from 'react';

export const useSmartSuggestions = () => {
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);

  // Smart suggestions based on email provider and attempts
  const generateSmartSuggestions = useCallback((email: string, attemptCount: number) => {
    const suggestions: string[] = [];
    const domain = email.split('@')[1]?.toLowerCase();

    if (attemptCount === 0) {
      suggestions.push('Überprüfen Sie Ihren Posteingang');
    } else if (attemptCount === 1) {
      suggestions.push('Schauen Sie in Ihren Spam-Ordner');
      if (domain?.includes('gmail')) {
        suggestions.push('Prüfen Sie auch den "Werbung" Tab in Gmail');
      }
    } else if (attemptCount >= 2) {
      suggestions.push('Fügen Sie no-reply@renovirt.de zu Ihren Kontakten hinzu');
      suggestions.push('Versuchen Sie es mit einer anderen E-Mail-Adresse');
    }

    setSmartSuggestions(suggestions);
  }, []);

  return {
    smartSuggestions,
    generateSmartSuggestions
  };
};
