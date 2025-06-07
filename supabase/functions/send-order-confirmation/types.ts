
export interface OrderConfirmationRequest {
  orderNumber: string;
  customerEmail: string;
  orderDetails: {
    packageName: string;
    photoType: string;
    imageCount: number;
    totalPrice: number;
    extras: string[];
    customerSalutation?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail: string;
  };
}

export interface EmailTemplateData {
  orderNumber: string;
  customerGreeting: string;
  estimatedDelivery: string;
  orderDetails: OrderConfirmationRequest['orderDetails'];
  extrasHtml: string;
  currentYear: number;
}
