
import { useOrderData } from './useOrderData';
import { useOrderCreation } from './useOrderCreation';
import { calculateOrderTotal } from '@/utils/orderPricing';
import type { OrderData } from '@/utils/orderValidation';

export const useOrders = () => {
  const { packages, addOns, packagesLoading, addOnsLoading } = useOrderData();
  const { createOrder, isCreatingOrder } = useOrderCreation(packages, addOns);

  // Calculate total price
  const calculateTotalPrice = (orderData: OrderData) => {
    return calculateOrderTotal(orderData, packages, addOns);
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
