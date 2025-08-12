
import { supabase } from '@/integrations/supabase/client';
import type { OrderData } from '@/utils/orderValidation';

export const prepareOrderEmailDetails = async (
  orderData: OrderData,
  selectedPackage: any,
  imageCount: number,
  totalPrice: number,
  selectedAddOns: any[],
  userId: string
) => {
  // Fetch customer profile for personalized greeting
  let customerData = {
    customerSalutation: undefined as string | undefined,
    customerFirstName: undefined as string | undefined,
    customerLastName: undefined as string | undefined,
  };

  try {
    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('salutation, first_name, last_name')
      .eq('user_id', userId)
      .single();

    if (profile) {
      customerData = {
        customerSalutation: profile.salutation || undefined,
        customerFirstName: profile.first_name || undefined,
        customerLastName: profile.last_name || undefined,
      };
    }
  } catch (error) {
    console.warn('Could not fetch customer profile for email:', error);
  }

  // Format extras as array of strings for email template
  const extrasArray: string[] = [];
  if (orderData.extras.upscale) extrasArray.push('Upscaling');
  if (orderData.extras.express) extrasArray.push('Express-Bearbeitung');
  if (orderData.extras.watermark) extrasArray.push('Wasserzeichen entfernen');

  return {
    packageName: selectedPackage.name,
    photoType: orderData.photoType,
    imageCount,
    totalPrice,
    extras: extrasArray,
    customerEmail: orderData.email || '',
    ...customerData
  };
};

export const validateEmailAddress = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const sendOrderConfirmationEmail = async (
  orderNumber: string,
  email: string,
  orderDetails: any
) => {
  try {
    // Validate email address before sending
    const trimmedEmail = email?.trim();
    if (!validateEmailAddress(trimmedEmail)) {
      const errorMsg = `Invalid email address for order ${orderNumber}: "${email}"`;
      console.error(errorMsg);
      throw new Error(`E-Mail-Adresse ungültig: ${email || 'leer'}`);
    }

    console.log('Sending confirmation email for order:', orderNumber, 'to:', trimmedEmail);
    console.log('Order details for email:', {
      orderNumber,
      customerEmail: trimmedEmail,
      packageName: orderDetails.packageName,
      photoType: orderDetails.photoType,
      imageCount: orderDetails.imageCount,
      totalPrice: orderDetails.totalPrice,
      extras: orderDetails.extras
    });
    
    const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
      body: {
        orderNumber,
        customerEmail: trimmedEmail,
        orderDetails: {
          ...orderDetails,
          customerEmail: trimmedEmail // Ensure email is in orderDetails too
        }
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`E-Mail-Service-Fehler: ${error.message}`);
    }

    console.log('Confirmation email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
};
