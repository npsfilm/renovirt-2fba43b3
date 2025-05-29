
import { validateFile } from './inputValidation';

export interface OrderData {
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  couponCode?: string;
  acceptedTerms: boolean;
}

export const validateOrderFiles = (files: File[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.valid) {
      errors.push(`${file.name}: ${validation.error}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateEffectiveImageCount = (files: File[], photoType?: string): number => {
  let imageCount = files.length;
  if (photoType === 'bracketing-3') {
    imageCount = Math.floor(files.length / 3);
  } else if (photoType === 'bracketing-5') {
    imageCount = Math.floor(files.length / 5);
  }
  return imageCount;
};
