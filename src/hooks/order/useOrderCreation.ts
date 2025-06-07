
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
      
      // For Stripe payments, we only create a temporary order reference and return it
      // The actual order will be created after successful payment
      if (paymentMethod === 'stripe') {
        const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
        if (!selectedPackage) throw new Error('Package not found');

        const totalPrice = calculateOrderTotal(orderData, packages, addOns);
        
        // Return order data for payment processing without creating in database
        return {
          id: 'temp-stripe-order', // Temporary ID for payment processing
          orderData,
          totalPrice,
          selectedPackage,
          isTemporaryOrder: true // Changed property name to avoid conflicts
        };
      }
      
      // For invoice payments, create the order immediately as before
      const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
      if (!selectedPackage) throw new Error('Package not found');

      const totalPrice = calculateOrderTotal(orderData, packages, addOns);
      const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
      
      // Create order in database for invoice payments
      const order = await createOrderInDatabase({ orderData, paymentMethod }, packages, addOns, user.id);

      // Upload files for invoice orders
      await handleOrderFiles(orderData, order.id, user.id);
      
      // Get selected add-ons for email
      const selectedAddOns = addOns.filter(addon => 
        orderData.extras[addon.name as keyof typeof orderData.extras]
      );
      
      // Send confirmation email for invoice orders
      try {
        const orderDetails = await prepareOrderEmailDetails(
          orderData,
          selectedPackage,
          imageCount,
          totalPrice,
          selectedAddOns,
          user.id
        );

        await sendOrderConfirmationEmail(order.order_number, orderData.email || '', orderDetails);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      return order;
    },
    onSuccess: (order, { paymentMethod }) => {
      // Only invalidate queries for invoice payments (immediately visible)
      if (paymentMethod === 'invoice') {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        
        toast({
          title: "Bestellung erfolgreich erstellt!",
          description: "Ihre Bestellung wurde erfolgreich übermittelt.",
        });
      } else if (paymentMethod === 'stripe' && !order.isTemporaryOrder) {
        // This is for completed Stripe orders (called after payment success)
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      }
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

  // New method to create order after successful Stripe payment
  const createOrderAfterPayment = async (orderData: OrderData, paymentIntentId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
    if (!selectedPackage) throw new Error('Package not found');

    const totalPrice = calculateOrderTotal(orderData, packages, addOns);
    const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
    
    // Create order in database with payment already completed
    const order = await createOrderInDatabase(
      { orderData, paymentMethod: 'stripe' }, 
      packages, 
      addOns, 
      user.id,
      paymentIntentId
    );

    // Upload files
    await handleOrderFiles(orderData, order.id, user.id);
    
    // Get selected add-ons for email
    const selectedAddOns = addOns.filter(addon => 
      orderData.extras[addon.name as keyof typeof orderData.extras]
    );
    
    // Send confirmation email
    try {
      const orderDetails = await prepareOrderEmailDetails(
        orderData,
        selectedPackage,
        imageCount,
        totalPrice,
        selectedAddOns,
        user.id
      );

      await sendOrderConfirmationEmail(order.order_number, orderData.email || '', orderDetails);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Invalidate queries to refresh the UI
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });

    return order;
  };

  return {
    createOrder: createOrderMutation.mutateAsync,
    createOrderAfterPayment,
    isCreatingOrder: createOrderMutation.isPending,
  };
};
