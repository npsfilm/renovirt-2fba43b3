
export interface OrderData {
  files: File[];
  package: 'Basic' | 'Premium';
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  watermarkFile?: File;
  email?: string;
  company?: string;
  objectReference?: string;
  specialRequests?: string;
  acceptedTerms: boolean;
}

export const calculateEffectiveImageCount = (files: File[], photoType?: string): number => {
  if (!files) {
    return 0;
  }

  if (photoType === 'bracketing-3') {
    const bracketingGroups = new Set<string>();
    files.forEach(file => {
      const match = file.name.match(/(.+?)_\d+\.(jpg|jpeg|png)$/i);
      if (match) {
        bracketingGroups.add(match[1]);
      }
    });
    return bracketingGroups.size;
  } else if (photoType === 'bracketing-5') {
    const bracketingGroups = new Set<string>();
    files.forEach(file => {
      const match = file.name.match(/(.+?)_\d+\.(jpg|jpeg|png)$/i);
      if (match) {
        bracketingGroups.add(match[1]);
      }
    });
    return bracketingGroups.size;
  }

  return files.length;
};

export const validateOrderFiles = (files: File[]) => {
  const errors: string[] = [];
  
  if (!files || files.length === 0) {
    errors.push('Please select at least one file');
  }
  
  files.forEach(file => {
    if (!file.type.startsWith('image/')) {
      errors.push(`${file.name} is not a valid image file`);
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      errors.push(`${file.name} is too large (max 50MB)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
