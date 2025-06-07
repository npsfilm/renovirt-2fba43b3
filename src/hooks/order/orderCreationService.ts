
import { supabase } from '@/integrations/supabase/client';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { generateOrderNumber } from '@/utils/orderNumberGenerator';
import type { OrderData } from '@/utils/orderValidation';
import type { OrderCreationParams, PaymentMethod } from './orderCreationTypes';

export const createOrderInDatabase = async (
  { orderData, paymentMethod }: OrderCreationParams,
  packages: any[],
  addOns: any[],
  userId: string,
  stripePaymentIntentId?: string
) => {
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) {
    throw new Error('Selected package not found');
  }

  const totalPrice = calculateOrderTotal(orderData, packages, addOns);
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  const orderNumber = generateOrderNumber();

  // For Stripe payments, set payment status based on whether we have a payment intent ID
  const paymentStatus = paymentMethod === 'stripe' 
    ? (stripePaymentIntentId ? 'paid' : 'pending')
    : 'pending';
    
  const paymentFlowStatus = paymentMethod === 'stripe' 
    ? (stripePaymentIntentId ? 'payment_completed' : 'payment_pending')
    : 'payment_pending';

  const orderPayload = {
    user_id: userId,
    package_id: selectedPackage.id,
    total_price: totalPrice,
    customer_email: orderData.email,
    photo_type: orderData.photoType,
    image_count: imageCount,
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    payment_flow_status: paymentFlowStatus,
    status: stripePaymentIntentId ? 'processing' : 'pending', // Start processing if payment is completed
    order_number: orderNumber,
    terms_accepted: orderData.acceptedTerms,
    stripe_session_id: stripePaymentIntentId || null,
    // Handle bracketing settings
    bracketing_enabled: orderData.photoType === 'bracketing',
    bracketing_exposures: orderData.photoType === 'bracketing' ? 3 : null,
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) {
    console.error('Failed to create order:', orderError);
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // Add selected add-ons to the order
  const selectedAddOnIds = addOns
    .filter(addon => orderData.extras[addon.name as keyof typeof orderData.extras])
    .map(addon => addon.id);

  if (selectedAddOnIds.length > 0) {
    const addOnInserts = selectedAddOnIds.map(addOnId => ({
      order_id: order.id,
      add_on_id: addOnId,
    }));

    const { error: addOnError } = await supabase
      .from('order_add_ons')
      .insert(addOnInserts);

    if (addOnError) {
      console.error('Failed to add order add-ons:', addOnError);
      // Don't throw here as the order was created successfully
    }
  }

  return order;
};
