
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key - this is a public key, safe to include
const stripePromise = loadStripe(
  'pk_live_51RVC15GBJSdVtvnbWNXeloDmabSIjTKHk1E3m6TmAgEhSptSbSorOSqxqFlZf0hERNpMJ18fx3EYhBXoGdwgtkSU00tora2LR4'
);

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

const StripeProvider = ({ children, clientSecret }: StripeProviderProps) => {
  if (!clientSecret) {
    console.error('Client secret is required for Stripe Elements');
    return <div>Zahlungskonfiguration wird geladen...</div>;
  }

  const options = {
    clientSecret,
    locale: 'de' as const, // Deutsche Lokalisierung für bessere UX
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#16a34a',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
    },
    // Bessere Konfiguration für alternative Zahlungsmethoden
    paymentMethodCreation: 'manual',
    paymentMethodOptions: {
      klarna: {
        // Automatische Ländererkennung für optimale Klarna-Konfiguration
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
