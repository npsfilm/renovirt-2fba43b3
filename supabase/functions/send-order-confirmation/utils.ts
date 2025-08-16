
import type { OrderConfirmationRequest } from './types.ts';

export const getEstimatedDelivery = (extras: string[]): string => {
  // Check for various express option formats
  const hasExpress = extras.some(extra => 
    extra.toLowerCase().includes('express') || 
    extra.toLowerCase().includes('schnell')
  );
  return hasExpress ? '24 Stunden' : '48 Stunden';
};

export const getCustomerGreeting = (orderDetails: OrderConfirmationRequest['orderDetails']): string => {
  if (orderDetails.customerSalutation && orderDetails.customerLastName) {
    // Normalize salutation to proper case
    const normalizedSalutation = orderDetails.customerSalutation.toLowerCase() === 'frau' ? 'Frau' : 'Herr';
    const isFemale = normalizedSalutation === 'Frau';
    return `Sehr geehrte${isFemale ? ' ' : 'r '}${normalizedSalutation} ${orderDetails.customerLastName}`;
  }
  return 'Sehr geehrte Damen und Herren';
};

export const generateExtrasHtml = (extras: string[]): string => {
  return extras.length > 0 
    ? `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;">Gewählte Extras</td>
        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;text-align:right;">${extras.join(', ')}</td>
      </tr>
    `
    : '';
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
