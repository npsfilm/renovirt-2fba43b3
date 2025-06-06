
import { supabase } from '@/integrations/supabase/client';
import type { EmailOrderDetails } from './orderCreationTypes';

export const sendOrderConfirmationEmail = async (
  orderNumber: string,
  customerEmail: string,
  orderDetails: EmailOrderDetails
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Send order confirmation email
    const { error } = await supabase.functions.invoke('send-order-confirmation', {
      body: {
        orderNumber,
        customerEmail,
        orderDetails,
      },
    });
    
    if (error) {
      console.error('Failed to send confirmation email:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (emailError: any) {
    // Log error but don't fail the overall process
    console.error('Failed to send confirmation email:', emailError);
    return { 
      success: false, 
      error: emailError.message || 'Unknown error sending confirmation email' 
    };
  }
};

export const prepareOrderEmailDetails = (
  orderData: any,
  selectedPackage: any,
  imageCount: number,
  totalPrice: number,
  selectedAddOns: any[]
): EmailOrderDetails => {
  // Format extras for email
  const selectedExtras = selectedAddOns
    .map(addon => addon.description);

  return {
    packageName: selectedPackage.description,
    photoType: formatPhotoType(orderData.photoType),
    imageCount,
    totalPrice,
    extras: selectedExtras,
  };
};

const formatPhotoType = (photoType?: string): string => {
  if (!photoType) return 'Standard';
  
  switch (photoType) {
    case 'handy': return 'Smartphone';
    case 'kamera': return 'Kamera';
    case 'bracketing-3': return 'Bracketing (3 Bilder)';
    case 'bracketing-5': return 'Bracketing (5 Bilder)';
    default: return photoType;
  }
};
