
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment or use a placeholder
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_placeholder_key_needs_to_be_configured'
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

  // Check if we have a valid Stripe key
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey || stripeKey.includes('placeholder')) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Stripe-Konfiguration erforderlich</h3>
        <p className="text-muted-foreground">
          Bitte konfigurieren Sie Ihren Stripe-Schlüssel in den Umgebungsvariablen.
        </p>
      </div>
    );
  }

  const options = {
    clientSecret,
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
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
