
import type { OrderData } from '@/utils/orderValidation';

export type PaymentMethod = 'stripe' | 'invoice';

export interface OrderCreationParams {
  orderData: OrderData;
  paymentMethod: PaymentMethod;
}
