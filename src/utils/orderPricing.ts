
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

// Net prices per image for packages (these are the actual net prices)
const PACKAGE_NET_PRICES = {
  Basic: 7.56,    // Net price that results in 9.00 gross (7.56 * 1.19 = 9.00)
  Premium: 10.92, // Net price that results in 13.00 gross (10.92 * 1.19 = 13.00)
};

// Net prices per image for extras
const EXTRAS_NET_PRICES = {
  express: 1.68,    // Net price that results in 2.00 gross (1.68 * 1.19 = 2.00)
  upscale: 1.68,    // Net price that results in 2.00 gross
  watermark: 1.68,  // Net price that results in 2.00 gross
};

export const calculateOrderTotal = (
  orderData: OrderData,
  packages: Package[],
  addOns: AddOn[]
): number => {
  // Get net price per image for the selected package
  const packageNetPrice = PACKAGE_NET_PRICES[orderData.package as keyof typeof PACKAGE_NET_PRICES];
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);

  let netTotal = packageNetPrice * imageCount;

  // Add extras with net prices
  Object.entries(orderData.extras).forEach(([extraName, isSelected]) => {
    if (isSelected && extraName in EXTRAS_NET_PRICES) {
      const pricePerImage = EXTRAS_NET_PRICES[extraName as keyof typeof EXTRAS_NET_PRICES];
      netTotal += pricePerImage * imageCount;
    }
  });

  // Add legacy database add-ons support (convert to net if needed)
  addOns.forEach(addon => {
    if (orderData.extras[addon.name as keyof typeof orderData.extras] && !addon.is_free) {
      // Assume addon.price is gross, convert to net
      const netPrice = addon.price / (1 + VAT_RATE);
      netTotal += netPrice * imageCount;
    }
  });

  // Add VAT to get gross total
  return netTotal * (1 + VAT_RATE);
};

export const calculateOrderPricing = (orderData: OrderData, availableCredits: number = 0) => {
  // Get net price per image for the selected package
  const packageNetPrice = PACKAGE_NET_PRICES[orderData.package as keyof typeof PACKAGE_NET_PRICES];
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  
  let calculatedNetPrice = packageNetPrice * imageCount;
  
  // Add extras pricing (net)
  Object.entries(orderData.extras).forEach(([extraName, isSelected]) => {
    if (isSelected && extraName in EXTRAS_NET_PRICES) {
      const pricePerImage = EXTRAS_NET_PRICES[extraName as keyof typeof EXTRAS_NET_PRICES];
      calculatedNetPrice += pricePerImage * imageCount;
    }
  });
  
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
