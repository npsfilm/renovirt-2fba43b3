
import type { OrderData } from './orderValidation';

export const calculateOrderTotal = (
  orderData: OrderData,
  packages: any[],
  addOns: any[]
): number => {
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) return 0;

  const imageCount = orderData.photoType === 'bracketing-3' 
    ? Math.floor(orderData.files.length / 3)
    : orderData.photoType === 'bracketing-5'
    ? Math.floor(orderData.files.length / 5)
    : orderData.files.length;

  let total = selectedPackage.base_price * imageCount;

  // Add extras
  if (orderData.extras.upscale) {
    total += 2.00 * imageCount;
  }
  if (orderData.extras.express) {
    total += 2.00 * imageCount;
  }
  if (orderData.extras.watermark) {
    total += 2.00 * imageCount;
  }

  return total;
};
