
import { useOrderData } from './useOrderData';
import { useOrderCreation } from './useOrderCreation';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import type { OrderData } from '@/utils/orderValidation';

// Net prices per image
const PACKAGE_NET_PRICES = {
  Basic: 9.00,
  Premium: 13.00,
};

const EXTRAS_NET_PRICE = 2.00;

export const useOrders = () => {
  const { packages, addOns, packagesLoading, addOnsLoading } = useOrderData();
  const { createOrder: createOrderBase, isCreatingOrder } = useOrderCreation(packages, addOns);

  // Calculate total price (returns gross price)
  const calculateTotalPrice = (orderData: OrderData) => {
    if (!orderData.package) return 0;
    
    const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
    const packageNetPrice = PACKAGE_NET_PRICES[orderData.package as keyof typeof PACKAGE_NET_PRICES] || 0;
    let totalNetPrice = packageNetPrice * imageCount;
    
    // Add extras
    if (orderData.extras.upscale) totalNetPrice += EXTRAS_NET_PRICE * imageCount;
    if (orderData.extras.express) totalNetPrice += EXTRAS_NET_PRICE * imageCount;
    if (orderData.extras.watermark) totalNetPrice += EXTRAS_NET_PRICE * imageCount;
    
    // Calculate gross price (net + 19% VAT)
    const grossPrice = totalNetPrice * 1.19;
    
    return grossPrice;
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
