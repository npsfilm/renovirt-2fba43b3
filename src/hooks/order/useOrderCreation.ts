
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
      
      // Only invoice payments are supported now
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
      
      // Validate email before sending confirmation
      if (!orderData.email || orderData.email.trim().length === 0) {
        console.error('No email address provided for order:', order.order_number);
        secureLog('Order created without email confirmation - no email provided', { 
          orderId: order.id, 
          orderNumber: order.order_number 
        });
        
        toast({
          title: "Achtung",
          description: "Bestellung erstellt, aber keine Bestätigungs-E-Mail versendet (keine E-Mail-Adresse).",
          variant: "destructive",
        });
      } else {
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

          await sendOrderConfirmationEmail(order.order_number, orderData.email, orderDetails);
          
          secureLog('Order confirmation email sent successfully', { 
            orderId: order.id,
            orderNumber: order.order_number,
            email: orderData.email 
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          secureLog('Email sending failed but order created', { 
            orderId: order.id, 
            orderNumber: order.order_number,
            email: orderData.email,
            error: emailError 
          });
          
          toast({
            title: "Bestellung erstellt",
            description: "Bestellung erfolgreich erstellt, aber E-Mail-Versand fehlgeschlagen. Bitte kontaktieren Sie den Support.",
            variant: "destructive",
          });
        }
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
    onSuccess: () => {
      // Always invalidate queries for invoice payments
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      
      toast({
        title: "Bestellung erfolgreich erstellt!",
        description: "Ihre Bestellung wurde erfolgreich übermittelt.",
      });
    },
    onError: (error: any) => {
      secureLog('Order creation error:', error);
      
      let errorMessage = error.message || 'Es ist ein unerwarteter Fehler aufgetreten';
      
      // Handle specific foreign key constraint violation
      if (error.message && error.message.includes('fk_orders_customer_profiles')) {
        errorMessage = 'Kundenprofil ist unvollständig. Bitte vervollständigen Sie Ihr Profil und versuchen Sie es erneut.';
        secureLog('Foreign key constraint violation - customer profile missing', { 
          userId: user?.id, 
          error: error.message 
        });
      }
      
      toast({
        title: "Fehler bei der Bestellung",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Simplified method for invoice orders (no payment processing needed)
  const createOrderAfterPayment = async (orderData: OrderData) => {
    // For invoice payments, just use the regular createOrder flow
    return createOrderMutation.mutateAsync({ orderData, paymentMethod: 'invoice' });
  };

  return {
    createOrder: createOrderMutation.mutateAsync,
    createOrderAfterPayment,
    isCreatingOrder: createOrderMutation.isPending,
  };
};
