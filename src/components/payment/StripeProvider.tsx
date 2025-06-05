
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_live_51RVC15GBJSdVtvnbWNXeloDmabSIjTKHk1E3m6TmAgEhSptSbSorOSqxqFlZf0hERNpMJ18fx3EYhBXoGdwgtkSU00tora2LR4');

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

const StripeProvider = ({ children, clientSecret }: StripeProviderProps) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#16a34a', // Green to match your app
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
    <Elements stripe={stripePromise} options={clientSecret ? options : undefined}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
