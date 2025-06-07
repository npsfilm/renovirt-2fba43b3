
import type { OrderData } from './orderValidation';
import { calculateEffectiveImageCount } from './orderValidation';

interface Package {
  id: string;
  name: string;
  base_price: number;
  description: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  is_free: boolean;
}

const VAT_RATE = 0.19; // 19% VAT

export const calculateOrderTotal = (
  orderData: OrderData,
  packages: Package[],
  addOns: AddOn[]
): number => {
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) return 0;

  let netTotal = selectedPackage.base_price;
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);

  // Multiply by image count
  netTotal *= imageCount;

  // Add extras
  addOns.forEach(addon => {
    if (orderData.extras[addon.name as keyof typeof orderData.extras] && !addon.is_free) {
      netTotal += addon.price * imageCount;
    }
  });

  // Add VAT to get gross total
  return netTotal * (1 + VAT_RATE);
};

export const calculateOrderPricing = (orderData: OrderData, availableCredits: number = 0) => {
  // Base pricing calculation (simplified version)
  const baseNetPrice = 5; // Base net price per image
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  
  let calculatedNetPrice = baseNetPrice * imageCount;
  
  // Add extras pricing (net)
  if (orderData.extras.express) calculatedNetPrice += imageCount * 2;
  if (orderData.extras.upscale) calculatedNetPrice += imageCount * 1.5;
  if (orderData.extras.watermark) calculatedNetPrice += imageCount * 0.5;
  
  // Add VAT to get gross price
  const calculatedGrossPrice = calculatedNetPrice * (1 + VAT_RATE);
  
  // Calculate maximum credits that can be applied (against gross price)
  const creditsDiscount = Math.min(availableCredits, calculatedGrossPrice);
  
  return {
    calculatedPrice: calculatedGrossPrice,
    creditsDiscount,
    finalPrice: Math.max(0, calculatedGrossPrice - creditsDiscount)
  };
};
