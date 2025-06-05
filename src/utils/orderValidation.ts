
import { z } from 'zod';

export const OrderDataSchema = z.object({
  email: z.string().email(),
  contactPerson: z.string().optional(),
  company: z.string().optional(),
  photoType: z.enum(['interior', 'exterior', 'both']),
  packageType: z.enum(['basic', 'standard', 'premium']),
  imageCount: z.number().min(1),
  files: z.array(z.object({
    file: z.instanceof(File),
    id: z.string(),
    preview: z.string()
  })),
  specialRequests: z.string().optional(),
  acceptedTerms: z.boolean(),
  creditsUsed: z.number().optional().default(0),
  originalPrice: z.number().optional(),
  finalPrice: z.number().optional()
});

export type OrderData = z.infer<typeof OrderDataSchema>;

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
