
import type { OrderData } from './orderValidation';
import { calculateEffectiveImageCount } from './orderValidation';

// Net prices per image
const PACKAGE_NET_PRICES = {
  Basic: 9.00,
  Premium: 13.00,
};

const EXTRAS_NET_PRICE = 2.00;

export const calculateOrderTotal = (orderData: OrderData, packages: any[], addOns: any[]): number => {
  if (!orderData.package) return 0;
  
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  const packageNetPrice = PACKAGE_NET_PRICES[orderData.package as keyof typeof PACKAGE_NET_PRICES] || 0;
  let totalNetPrice = packageNetPrice * imageCount;
  
  // Add extras
  if (orderData.extras.upscale) totalNetPrice += EXTRAS_NET_PRICE * imageCount;
  if (orderData.extras.express) totalNetPrice += EXTRAS_NET_PRICE * imageCount;
  if (orderData.extras.watermark) totalNetPrice += EXTRAS_NET_PRICE * imageCount;
  
  // Return gross price (net + 19% VAT)
  return totalNetPrice * 1.19;
};
