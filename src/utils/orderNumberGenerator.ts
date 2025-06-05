
export const generateOrderNumber = (): string => {
  // Generate 6-digit random number
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `RV-${randomNumber}`;
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
