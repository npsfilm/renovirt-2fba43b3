
export const generateOrderNumber = (): string => {
  // Get current date
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  // Generate 3 random digits
  const randomNumbers = Math.floor(100 + Math.random() * 900);
  
  return `RV-${day}${month}${randomNumbers}`;
};

export const ensureUniqueOrderNumber = async (generateFn: () => string, checkUnique: (orderNumber: string) => Promise<boolean>): Promise<string> => {
  let orderNumber: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    orderNumber = generateFn();
    isUnique = await checkUnique(orderNumber);
    attempts++;
  } while (!isUnique && attempts < maxAttempts);

  if (!isUnique) {
    throw new Error('Failed to generate unique order number after maximum attempts');
  }

  return orderNumber;
};
