
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { secureLog } from '@/utils/secureLogging';
import type { OrderData } from '@/utils/orderValidation';
import type { OrderCreationParams, PaymentMethod } from './orderCreationTypes';
import { createOrderInDatabase } from './orderCreationService';
import { useOrderFileUpload } from './useOrderFileUpload';
import { sendOrderConfirmationEmail, prepareOrderEmailDetails } from './orderEmailService';

export const useOrderCreation = (packages: any[], addOns: any[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleOrderFiles } = useOrderFileUpload();

  const createOrderMutation = useMutation({
    mutationFn: async ({ orderData, paymentMethod }: { orderData: OrderData; paymentMethod: PaymentMethod }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get package and calculate totals
      const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
      if (!selectedPackage) throw new Error('Package not found');

      const totalPrice = calculateOrderTotal(orderData, packages, addOns);
      const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
      
      // Create order in database
      const order = await createOrderInDatabase({ orderData, paymentMethod }, packages, addOns, user.id);

      // Upload files
      await handleOrderFiles(orderData, order.id, user.id);
      
      // Get selected add-ons for email
      const selectedAddOns = addOns.filter(addon => 
        orderData.extras[addon.name as keyof typeof orderData.extras]
      );
      
      // Send confirmation email only if payment is completed or invoice method was used
      if (paymentMethod === 'invoice' || (paymentMethod === 'stripe' && order.payment_status === 'paid')) {
        try {
          const orderDetails = await prepareOrderEmailDetails(
            orderData,
            selectedPackage,
            imageCount,
            totalPrice,
            selectedAddOns,
            user.id
          );

          // Send order confirmation email
          await sendOrderConfirmationEmail(order.order_number, orderData.email || '', orderDetails);
        } catch (emailError) {
          // Log error but don't fail the order creation
          console.error('Failed to send confirmation email:', emailError);
        }
      }

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
    onError: (error: any) => {
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
