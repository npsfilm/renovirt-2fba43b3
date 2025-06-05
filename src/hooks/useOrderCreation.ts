
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { uploadOrderFiles } from '@/utils/fileUploadService';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';
import { generateOrderNumber } from '@/utils/orderNumberGenerator';
import type { OrderData } from '@/utils/orderValidation';

export const useOrderCreation = (packages: any[], addOns: any[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async ({ orderData, paymentMethod }: { orderData: OrderData; paymentMethod: 'stripe' | 'invoice' }) => {
      if (!user) {
        logSecurityEvent('order_creation_unauthorized');
        throw new Error('User not authenticated');
      }
      
      logSecurityEvent('order_creation_started', { userId: user.id, paymentMethod });
      
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

      // Generate unique order number
      let orderNumber = '';
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        orderNumber = generateOrderNumber();
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('order_number', orderNumber)
          .maybeSingle();
        
        if (!existingOrder) {
          break;
        }
        attempts++;
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique order number');
      }

      // Determine payment flow status based on payment method
      const paymentFlowStatus = paymentMethod === 'stripe' ? 'draft' : 'payment_completed';
      const orderStatus = paymentMethod === 'stripe' ? 'pending' : 'pending';

      // Create order with appropriate payment flow status and order number
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
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
        logSecurityEvent('order_creation_failed', { userId: user.id, error: orderError.message });
        throw orderError;
      }

      // Upload files
      await uploadOrderFiles(orderData.files, order.id, user.id, orderData.photoType);

      // Upload watermark file if provided
      if (orderData.watermarkFile && orderData.extras.watermark) {
        await uploadWatermarkFile(orderData.watermarkFile, order.id, user.id);
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
        userId: user.id, 
        paymentMethod,
        paymentFlowStatus 
      });
      return order;
    },
    onSuccess: (order, { paymentMethod }) => {
      // Only invalidate queries for invoice payments (immediately visible)
      if (paymentMethod === 'invoice') {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      }
      
      toast({
        title: paymentMethod === 'stripe' ? "Zur Zahlung weitergeleitet" : "Bestellung erfolgreich erstellt!",
        description: paymentMethod === 'stripe' 
          ? "Ihre Bestellung wird nach erfolgreicher Zahlung verarbeitet."
          : `Ihre Bestellung wurde erfolgreich übermittelt.`,
      });
    },
    onError: (error) => {
      secureLog('Order creation error:', error);
      toast({
        title: "Fehler bei der Bestellung",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  return {
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
  };
};

// Helper function to upload watermark files
const uploadWatermarkFile = async (file: File, orderId: string, userId: string) => {
  const fileName = `${orderId}/watermark-${Date.now()}-${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from('order-images')
    .upload(`${userId}/${fileName}`, file);

  if (uploadError) {
    logSecurityEvent('watermark_upload_failed', { fileName: file.name, error: uploadError.message });
    throw uploadError;
  }

  // Save watermark metadata to database
  const { error: dbError } = await supabase
    .from('order_images')
    .insert({
      order_id: orderId,
      file_name: `watermark-${file.name}`,
      file_size: file.size,
      file_type: file.type,
      storage_path: `${userId}/${fileName}`,
      is_bracketing_set: false,
    });

  if (dbError) {
    logSecurityEvent('watermark_metadata_save_failed', { fileName: file.name, error: dbError.message });
    throw dbError;
  }
};
