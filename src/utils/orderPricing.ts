
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

export const calculateOrderTotal = (
  orderData: OrderData,
  packages: Package[],
  addOns: AddOn[]
): number => {
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  if (!selectedPackage) return 0;

  let total = selectedPackage.base_price;
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);

  // Multiply by image count
  total *= imageCount;

  // Add extras
  addOns.forEach(addon => {
    if (orderData.extras[addon.name as keyof typeof orderData.extras] && !addon.is_free) {
      total += addon.price * imageCount;
    }
  });

  return total;
};
