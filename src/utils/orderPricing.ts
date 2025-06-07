
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

// Net prices per image for extras
const EXTRAS_NET_PRICES = {
  express: 2.00,    // 24h delivery
  upscale: 2.00,    // 4K upscale  
  watermark: 2.00,  // Custom watermark
};

export const calculateOrderTotal = (
  orderData: OrderData,
  packages: Package[],
  addOns: AddOn[]
): number => {
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) {
    // Fallback to hardcoded values if package not found
    const fallbackPrice = orderData.package === 'basic' ? 9 : 13;
    let netTotal = fallbackPrice;
    const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
    netTotal *= imageCount;
    
    // Add new extras with fixed net prices
    Object.entries(orderData.extras).forEach(([extraName, isSelected]) => {
      if (isSelected && extraName in EXTRAS_NET_PRICES) {
        const pricePerImage = EXTRAS_NET_PRICES[extraName as keyof typeof EXTRAS_NET_PRICES];
        netTotal += pricePerImage * imageCount;
      }
    });
    
    return netTotal * (1 + VAT_RATE);
  }

  let netTotal = selectedPackage.base_price;
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);

  // Multiply base package by image count
  netTotal *= imageCount;

  // Add database add-ons (legacy support)
  addOns.forEach(addon => {
    if (orderData.extras[addon.name as keyof typeof orderData.extras] && !addon.is_free) {
      netTotal += addon.price * imageCount;
    }
  });

  // Add new extras with fixed net prices
  Object.entries(orderData.extras).forEach(([extraName, isSelected]) => {
    if (isSelected && extraName in EXTRAS_NET_PRICES) {
      const pricePerImage = EXTRAS_NET_PRICES[extraName as keyof typeof EXTRAS_NET_PRICES];
      netTotal += pricePerImage * imageCount;
    }
  });

  // Add VAT to get gross total
  return netTotal * (1 + VAT_RATE);
};

export const calculateOrderPricing = (orderData: OrderData, availableCredits: number = 0) => {
  // Get package price - fallback to hardcoded values
  const packagePrice = orderData.package === 'basic' ? 9 : 13; // Net price per image
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  
  let calculatedNetPrice = packagePrice * imageCount;
  
  // Add extras pricing (net) with new fixed prices
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
