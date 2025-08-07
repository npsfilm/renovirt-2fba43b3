
import type { OrderData } from '@/utils/orderValidation';

export type PaymentMethod = 'invoice';

export interface OrderCreationParams {
  orderData: OrderData;
  paymentMethod: PaymentMethod;
}
