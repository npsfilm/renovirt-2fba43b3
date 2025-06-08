
import { supabase } from '@/integrations/supabase/client';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { generateOrderNumber } from '@/utils/orderNumberGenerator';
import type { OrderData } from '@/utils/orderValidation';
import type { OrderCreationParams } from './orderCreationTypes';

export const createOrderInDatabase = async (
  { orderData, paymentMethod }: OrderCreationParams,
  packages: any[],
  addOns: any[],
  userId: string,
  paymentIntentId?: string
) => {
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) throw new Error('Paket nicht gefunden');

  const totalPrice = calculateOrderTotal(orderData, packages, addOns);
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  const orderNumber = generateOrderNumber();

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      package_id: selectedPackage.id,
      total_price: totalPrice,
      image_count: imageCount,
      photo_type: orderData.photoType,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'stripe' ? 'paid' : 'pending',
      payment_intent_id: paymentIntentId,
      email: orderData.email,
      company: orderData.company,
      object_reference: orderData.objectReference,
      special_requests: orderData.specialRequests,
      extras: orderData.extras,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return order;
};
