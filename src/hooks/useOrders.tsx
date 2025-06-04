
import { useOrderData } from './useOrderData';
import { useOrderCreation } from './useOrderCreation';
import { calculateOrderTotal } from '@/utils/orderPricing';
import type { OrderData } from '@/utils/orderValidation';

export const useOrders = () => {
  const { packages, addOns, packagesLoading, addOnsLoading } = useOrderData();
  const { createOrder: createOrderBase, isCreatingOrder } = useOrderCreation(packages, addOns);

  // Calculate total price
  const calculateTotalPrice = (orderData: OrderData) => {
    return calculateOrderTotal(orderData, packages, addOns);
  };

  // Wrapper to include payment method
  const createOrder = async (orderData: OrderData, paymentMethod: 'stripe' | 'invoice' = 'stripe') => {
    return createOrderBase({ orderData, paymentMethod });
  };

  return {
    packages,
    addOns,
    packagesLoading,
    addOnsLoading,
    calculateTotalPrice,
    createOrder,
    isCreatingOrder,
  };
};
