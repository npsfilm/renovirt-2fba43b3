export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatPaymentMethod = (method: string): string => {
  switch (method) {
    case 'stripe':
      return 'Kreditkarte/Stripe';
    case 'invoice':
      return 'Rechnung';
    default:
      return method;
  }
};

export const formatPaymentStatus = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'Bezahlt';
    case 'pending':
      return 'Ausstehend';
    case 'failed':
      return 'Fehlgeschlagen';
    default:
      return status;
  }
};

export const generateExtrasHtml = (extras: string[]): string => {
  if (!extras || extras.length === 0) {
    return '<p style="color: #6b7280; font-style: italic;">Keine Extras ausgewählt</p>';
  }

  return `
    <ul style="margin: 0; padding-left: 20px; color: #374151;">
      ${extras.map(extra => `<li style="margin-bottom: 4px;">${extra}</li>`).join('')}
    </ul>
  `;
};

export const generateSpecialRequestsHtml = (specialRequests?: string): string => {
  if (!specialRequests || specialRequests.trim() === '') {
    return '<p style="color: #6b7280; font-style: italic;">Keine besonderen Wünsche</p>';
  }

  return `<p style="color: #374151; line-height: 1.5;">${specialRequests}</p>`;
};

export const getCustomerDisplayName = (customerDetails: any): string => {
  const { salutation, firstName, lastName, customerEmail } = customerDetails;
  
  if (firstName && lastName) {
    return salutation ? `${salutation} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
  }
  
  return customerEmail;
};