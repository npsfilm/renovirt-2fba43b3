
import { z } from 'zod';

export const OrderDataSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  contactPerson: z.string().optional(),
  company: z.string().optional(),
  photoType: z.enum(['handy', 'kamera', 'bracketing-3', 'bracketing-5']).optional(),
  package: z.enum(['basic', 'premium']).optional(),
  imageCount: z.number().min(1).optional(),
  files: z.array(z.instanceof(File)).default([]),
  extras: z.object({
    express: z.boolean(),
    upscale: z.boolean(),
    watermark: z.boolean(),
  }),
  specialRequests: z.string().optional(),
  acceptedTerms: z.boolean(),
  creditsUsed: z.number().optional().default(0),
  originalPrice: z.number().optional(),
  finalPrice: z.number().optional(),
  watermarkFile: z.instanceof(File).optional(),
  couponCode: z.string().optional(),
});

// Manually define the type to properly reflect the schema after parsing
export type OrderData = {
  id?: string;
  email?: string;
  contactPerson?: string;
  company?: string;
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  package?: 'basic' | 'premium';
  imageCount?: number;
  files: File[]; // Required after schema parsing due to default
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  specialRequests?: string;
  acceptedTerms: boolean;
  creditsUsed?: number;
  originalPrice?: number;
  finalPrice?: number;
  watermarkFile?: File;
  couponCode?: string;
};

export const validateOrderData = (data: Partial<OrderData>): { isValid: boolean; errors: string[] } => {
  try {
    OrderDataSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { isValid: false, errors: ['Unknown validation error'] };
  }
};

export const calculateEffectiveImageCount = (files: File[], photoType?: string): number => {
  if (!files || files.length === 0) return 0;
  
  if (photoType === 'bracketing-3') {
    return Math.ceil(files.length / 3);
  } else if (photoType === 'bracketing-5') {
    return Math.ceil(files.length / 5);
  }
  
  return files.length;
};

export const validateOrderFiles = (files: File[]) => {
  const errors: string[] = [];
  
  if (!files || files.length === 0) {
    errors.push('At least one file is required');
  }
  
  files.forEach((file, index) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      errors.push(`File ${index + 1} is too large (max 50MB)`);
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1} has invalid type. Only JPEG, PNG, and TIFF are allowed.`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
