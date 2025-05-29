
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { uploadOrderFiles } from '@/utils/fileUploadService';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';
import type { OrderData } from '@/utils/orderValidation';

export const useOrderCreation = (packages: any[], addOns: any[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderData) => {
      if (!user) {
        logSecurityEvent('order_creation_unauthorized');
        throw new Error('User not authenticated');
      }
      
      logSecurityEvent('order_creation_started', { userId: user.id });
      
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

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          package_id: selectedPackage.id,
          customer_email: orderData.email,
          photo_type: orderData.photoType,
          image_count: imageCount,
          total_price: totalPrice,
          bracketing_enabled: bracketingEnabled,
          bracketing_exposures: bracketingExposures,
          terms_accepted: orderData.acceptedTerms,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        logSecurityEvent('order_creation_failed', { userId: user.id, error: orderError.message });
        throw orderError;
      }

      // Upload files
      await uploadOrderFiles(orderData.files, order.id, user.id, orderData.photoType);

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

      logSecurityEvent('order_created_successfully', { orderId: order.id, userId: user.id });
      return order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Bestellung erfolgreich erstellt!",
        description: `Ihre Bestellung ${order.id.slice(-6)} wurde erfolgreich übermittelt.`,
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
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
  };
};
