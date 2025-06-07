
import type { OrderConfirmationRequest } from './types.ts';

export const getEstimatedDelivery = (extras: string[]): string => {
  return extras.includes('Express Bearbeitung') ? '24 Stunden' : '48 Stunden';
};

export const getCustomerGreeting = (orderDetails: OrderConfirmationRequest['orderDetails']): string => {
  if (orderDetails.customerSalutation && orderDetails.customerLastName) {
    return `Sehr geehrte${orderDetails.customerSalutation === 'Frau' ? ' ' : 'r '}${orderDetails.customerSalutation} ${orderDetails.customerLastName}`;
  } else if (orderDetails.customerFirstName) {
    return `Sehr geehrte Damen und Herren`;
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
