
import type { OrderData } from './orderValidation';
import { calculateEffectiveImageCount } from './orderValidation';

export const calculateOrderTotal = (orderData: OrderData, packages: any[], addOns: any[]): number => {
  if (!orderData.package || !packages.length) return 0;
  
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) return 0;
  
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  let total = selectedPackage.base_price * imageCount;
  
  // Add extras
  const extraPrice = 2.00; // Net price per image for extras
  
  if (orderData.extras.upscale) total += extraPrice * imageCount;
  if (orderData.extras.express) total += extraPrice * imageCount;
  if (orderData.extras.watermark) total += extraPrice * imageCount;
  
  return total;
};
