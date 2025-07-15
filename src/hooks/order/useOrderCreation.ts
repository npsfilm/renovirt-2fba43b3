
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
import { sendAdminOrderNotification } from './orderAdminNotificationService';

export const useOrderCreation = (packages: any[], addOns: any[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleOrderFiles } = useOrderFileUpload();

  const createOrderMutation = useMutation({
    mutationFn: async ({ orderData, paymentMethod }: { orderData: OrderData; paymentMethod: PaymentMethod }) => {
      if (!user) {
        throw new Error('Benutzer nicht authentifiziert');
      }

      // Validate required data
      if (!packages || packages.length === 0) {
        throw new Error('Pakete konnten nicht geladen werden');
      }

      if (!addOns) {
        throw new Error('Add-ons konnten nicht geladen werden');
      }
      
      // For Stripe payments, we only create a temporary order reference and return it
      // The actual order will be created after successful payment
      if (paymentMethod === 'stripe') {
        const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
        if (!selectedPackage) throw new Error('Paket nicht gefunden');

        const totalPrice = calculateOrderTotal(orderData, packages, addOns);
        
        // Return order data for payment processing without creating in database
        return {
          id: 'temp-stripe-order', // Temporary ID for payment processing
          orderData,
          totalPrice,
          selectedPackage,
          isTemporaryOrder: true // Flag to identify temporary orders
        };
      }
      
      // For invoice payments, create the order immediately as before
      const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
      if (!selectedPackage) throw new Error('Paket nicht gefunden');

      const totalPrice = calculateOrderTotal(orderData, packages, addOns);
      const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
      
      // Create order in database for invoice payments
      const order = await createOrderInDatabase({ orderData, paymentMethod }, packages, addOns, user.id);

      // Upload files for invoice orders
      try {
        await handleOrderFiles(orderData, order.id, user.id);
      } catch (fileError) {
        console.error('File upload error:', fileError);
        // Don't fail the entire order for file upload issues
        secureLog('File upload failed but order created', { orderId: order.id, error: fileError });
      }
      
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
        // Don't fail the order for email issues
        secureLog('Email sending failed but order created', { orderId: order.id, error: emailError });
      }

      // Send admin notification for invoice orders
      try {
        await sendAdminOrderNotification(
          order.order_number,
          orderData,
          selectedPackage,
          imageCount,
          totalPrice,
          selectedAddOns,
          user.id,
          paymentMethod,
          'pending' // Invoice orders start as pending
        );
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError);
        secureLog('Admin notification failed but order created', { orderId: order.id, error: adminEmailError });
      }

      return order;
    },
    onSuccess: (order, { paymentMethod }) => {
      // Check if this is a temporary order (Stripe payment pending)
      const isTemporaryOrder = 'isTemporaryOrder' in order && order.isTemporaryOrder;
      
      // Only invalidate queries for invoice payments (immediately visible)
      if (paymentMethod === 'invoice') {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        
        toast({
          title: "Bestellung erfolgreich erstellt!",
          description: "Ihre Bestellung wurde erfolgreich übermittelt.",
        });
      } else if (paymentMethod === 'stripe' && !isTemporaryOrder) {
        // This is for completed Stripe orders (called after payment success)
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      }
    },
    onError: (error: any) => {
      secureLog('Order creation error:', error);
      
      const errorMessage = error.message || 'Es ist ein unerwarteter Fehler aufgetreten';
      
      toast({
        title: "Fehler bei der Bestellung",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // New method to create order after successful Stripe payment
  const createOrderAfterPayment = async (orderData: OrderData, paymentIntentId: string) => {
    if (!user) {
      throw new Error('Benutzer nicht authentifiziert');
    }

    const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
    if (!selectedPackage) throw new Error('Paket nicht gefunden');

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
    try {
      await handleOrderFiles(orderData, order.id, user.id);
    } catch (fileError) {
      console.error('File upload error after payment:', fileError);
      secureLog('File upload failed after payment', { orderId: order.id, error: fileError });
    }
    
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
      console.error('Failed to send confirmation email after payment:', emailError);
      secureLog('Email sending failed after payment', { orderId: order.id, error: emailError });
    }

    // Send admin notification for completed Stripe orders
    try {
      await sendAdminOrderNotification(
        order.order_number,
        orderData,
        selectedPackage,
        imageCount,
        totalPrice,
        selectedAddOns,
        user.id,
        'stripe',
        'paid', // Stripe orders are paid after successful payment
        paymentIntentId
      );
    } catch (adminEmailError) {
      console.error('Failed to send admin notification after payment:', adminEmailError);
      secureLog('Admin notification failed after payment', { orderId: order.id, error: adminEmailError });
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
