
import { supabase } from '@/integrations/supabase/client';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { generateOrderNumber } from '@/utils/orderNumberGenerator';
import type { OrderData } from '@/utils/orderValidation';
import type { OrderCreationParams } from './orderCreationTypes';

const ensureCustomerProfile = async (userId: string) => {
  // Check if customer profile exists
  const { data: existingProfile, error: checkError } = await supabase
    .from('customer_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking customer profile:', checkError);
    return;
  }

  // If profile doesn't exist, create a minimal one
  if (!existingProfile) {
    const { error: insertError } = await supabase
      .from('customer_profiles')
      .insert({
        user_id: userId,
        role: 'client' // Default role
      });

    if (insertError) {
      console.error('Error creating customer profile:', insertError);
      throw new Error('Kundenprofil konnte nicht erstellt werden');
    }
  }
};

export const createOrderInDatabase = async (
  { orderData, paymentMethod }: OrderCreationParams,
  packages: any[],
  addOns: any[],
  userId: string,
  paymentIntentId?: string
) => {
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) throw new Error('Paket nicht gefunden');

  // Ensure customer profile exists before creating order
  await ensureCustomerProfile(userId);

  const totalPrice = calculateOrderTotal(orderData, packages, addOns);
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  const orderNumber = generateOrderNumber();

  // Create order with extras stored as JSONB
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
      payment_status: 'pending',
      payment_flow_status: 'payment_pending',
      payment_intent_id: paymentIntentId,
      customer_email: orderData.email,
      admin_notes: orderData.specialRequests,
      extras: orderData.extras, // Now properly stored as JSONB
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Update customer profile with company information if provided
  if (orderData.company) {
    const { error: profileError } = await supabase
      .from('customer_profiles')
      .update({ 
        company: orderData.company 
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Failed to update customer profile:', profileError);
      // Don't fail the order creation for profile update issues
    }
  }

  return order;
};
