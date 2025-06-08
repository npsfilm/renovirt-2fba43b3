
export interface OrderData {
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  files: File[];
  package?: 'Basic' | 'Premium';
  extras: {
    upscale: boolean;
    express: boolean;
    watermark: boolean;
  };
  watermarkFile?: File;
  email: string;
  acceptedTerms: boolean;
}

export const validateOrderData = (data: OrderData): boolean => {
  return !!(
    data.photoType &&
    data.files.length > 0 &&
    data.package &&
    data.email &&
    data.acceptedTerms
  );
};

export const calculateEffectiveImageCount = (files: File[], photoType?: string): number => {
  if (!photoType) return files.length;
  
  if (photoType === 'bracketing-3') {
    return Math.floor(files.length / 3);
  } else if (photoType === 'bracketing-5') {
    return Math.floor(files.length / 5);
  }
  
  return files.length;
};
