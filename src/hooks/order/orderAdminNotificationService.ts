import { supabase } from '@/integrations/supabase/client';
import type { OrderData } from '@/utils/orderValidation';

export const sendAdminOrderNotification = async (
  orderNumber: string,
  orderData: OrderData,
  selectedPackage: any,
  imageCount: number,
  totalPrice: number,
  selectedAddOns: any[],
  userId: string,
  paymentMethod: 'invoice',
  paymentStatus: string = 'pending',
  paymentIntentId?: string
) => {
  try {
    console.log('Sending admin notification for order:', orderNumber);

    // Fetch customer profile for detailed information
    let customerDetails = {
      customerName: orderData.email || 'Unbekannt',
      customerEmail: orderData.email || '',
      salutation: undefined as string | undefined,
      firstName: undefined as string | undefined,
      lastName: undefined as string | undefined,
      company: orderData.company || undefined,
    };

    try {
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('salutation, first_name, last_name, company')
        .eq('user_id', userId)
        .single();

      if (profile) {
        customerDetails = {
          ...customerDetails,
          salutation: profile.salutation || undefined,
          firstName: profile.first_name || undefined,
          lastName: profile.last_name || undefined,
          company: profile.company || orderData.company || undefined,
        };

        // Create display name
        if (profile.first_name && profile.last_name) {
          customerDetails.customerName = profile.salutation 
            ? `${profile.salutation} ${profile.first_name} ${profile.last_name}`
            : `${profile.first_name} ${profile.last_name}`;
        }
      }
    } catch (profileError) {
      console.warn('Could not fetch customer profile for admin notification:', profileError);
    }

    // Format extras as array of strings
    const extrasArray: string[] = [];
    if (orderData.extras.upscale) extrasArray.push('Upscaling');
    if (orderData.extras.express) extrasArray.push('Express-Bearbeitung');
    if (orderData.extras.watermark) extrasArray.push('Wasserzeichen entfernen');

    const adminNotificationData = {
      orderNumber,
      orderDetails: {
        packageName: selectedPackage.name,
        photoType: orderData.photoType,
        imageCount,
        totalPrice,
        extras: extrasArray,
        specialRequests: orderData.specialRequests || undefined,
      },
      customerDetails,
      paymentDetails: {
        paymentMethod,
        paymentStatus,
        paymentIntentId,
      },
    };

    const { data, error } = await supabase.functions.invoke('send-admin-order-notification', {
      body: adminNotificationData
    });

    if (error) {
      console.error('Admin notification edge function error:', error);
      throw new Error(`Admin notification service error: ${error.message}`);
    }

    console.log('Admin notification sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send admin order notification:', error);
    // Don't throw the error - admin notification failures shouldn't block orders
    return null; 
  }
};