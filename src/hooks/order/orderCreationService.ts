
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/secureLogging';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { generateOrderNumber } from '@/utils/orderNumberGenerator';
import type { OrderCreationParams, OrderCreationResult } from './orderCreationTypes';

export const createOrderInDatabase = async (
  { orderData, paymentMethod }: OrderCreationParams,
  packages: any[],
  addOns: any[],
  userId: string
): Promise<OrderCreationResult> => {
  logSecurityEvent('order_creation_started', { userId, paymentMethod });
  
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) throw new Error('Package not found');

  const totalPrice = calculateOrderTotal(orderData, packages, addOns);
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  
  let bracketingEnabled = false;
  let bracketingExposures = 3;
  
  if (orderData.photoType === 'bracketing-3') {
    bracketingEnabled = true;
    bracketingExposures = 3;
  } else if (orderData.photoType === 'bracketing-5') {
    bracketingEnabled = true;
    bracketingExposures = 5;
  }

  // Generate order number
  const orderNumber = generateOrderNumber();

  // Determine payment flow status based on payment method
  const paymentFlowStatus = paymentMethod === 'stripe' ? 'draft' : 'payment_completed';
  const orderStatus = paymentMethod === 'stripe' ? 'pending' : 'pending';

  // Create order with appropriate payment flow status and order number
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      package_id: selectedPackage.id,
      customer_email: orderData.email,
      photo_type: orderData.photoType,
      image_count: imageCount,
      total_price: totalPrice,
      bracketing_enabled: bracketingEnabled,
      bracketing_exposures: bracketingExposures,
      terms_accepted: orderData.acceptedTerms,
      status: orderStatus,
      payment_flow_status: paymentFlowStatus,
      payment_status: paymentMethod === 'invoice' ? 'pending' : null,
    })
    .select()
    .single();

  if (orderError) {
    logSecurityEvent('order_creation_failed', { userId, error: orderError.message });
    throw orderError;
  }

  // Add selected extras
  const selectedAddOns = addOns.filter(addon => 
    orderData.extras[addon.name as keyof typeof orderData.extras]
  );

  if (selectedAddOns.length > 0) {
    const { error: addOnsError } = await supabase
      .from('order_add_ons')
      .insert(
        selectedAddOns.map(addon => ({
          order_id: order.id,
          add_on_id: addon.id,
        }))
      );

    if (addOnsError) {
      logSecurityEvent('order_addons_failed', { orderId: order.id, error: addOnsError.message });
      throw addOnsError;
    }
  }

  logSecurityEvent('order_created_successfully', { 
    orderId: order.id, 
    orderNumber: orderNumber,
    userId, 
    paymentMethod,
    paymentFlowStatus 
  });

  return order;
};
