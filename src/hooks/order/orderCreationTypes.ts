
import type { OrderData } from '@/utils/orderValidation';

export type PaymentMethod = 'stripe' | 'invoice';

export interface OrderCreationParams {
  orderData: OrderData;
  paymentMethod: PaymentMethod;
}

export interface OrderCreationResult {
  id: string;
  order_number: string;
  payment_flow_status: string;
  [key: string]: any;
}

export interface OrderCreationError {
  message: string;
  code?: string;
  details?: any;
}

export interface EmailOrderDetails {
  packageName: string;
  photoType: string;
  imageCount: number;
  totalPrice: number;
  extras: string[];
}
