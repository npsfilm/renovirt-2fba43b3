export interface AdminOrderNotificationRequest {
  orderNumber: string;
  orderDetails: {
    packageName: string;
    photoType: string;
    imageCount: number;
    totalPrice: number;
    extras: string[];
    specialRequests?: string;
  };
  customerDetails: {
    customerName: string;  
    customerEmail: string;
    company?: string;
    salutation?: string;
    firstName?: string;
    lastName?: string;
  };
  paymentDetails: {
    paymentMethod: string;
    paymentStatus: string;
    paymentIntentId?: string;
  };
}

export interface AdminEmailTemplateData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  packageName: string;
  photoType: string;
  imageCount: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  extrasHtml: string;
  specialRequestsHtml: string;
  orderDate: string;
  adminPanelUrl: string;
  currentYear: number;
}