
export const generateOrderNumber = (): string => {
  const now = new Date();
  
  // Get year as 2 digits (e.g., 2025 → 25)
  const year = now.getFullYear().toString().slice(-2);
  
  // Get month as 2 digits with leading zero if needed (e.g., 6 → 06)
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  // Get day as 2 digits with leading zero if needed (e.g., 3 → 03)
  const day = now.getDate().toString().padStart(2, '0');
  
  // Generate 3-digit random number (100-999)
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  
  return `RV-${year}${month}${day}${randomNumber}`;
};
