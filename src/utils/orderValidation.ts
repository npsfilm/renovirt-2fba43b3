
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
  company?: string;
  objectReference?: string;
  specialRequests?: string;
}

export const validateOrderData = (data: OrderData): boolean => {
  return !!(
    data.photoType &&
    data.files.length > 0 &&
    data.package &&
    data.email &&
    data.email.includes('@') &&
    data.acceptedTerms
  );
};

export const validateEmailAddress = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateOrderFiles = (files: File[]): FileValidationResult => {
  const errors: string[] = [];
  const supportedFormats = ['jpg', 'jpeg', 'png', 'cr2', 'cr3', 'nef', 'arw', 'dng', 'zip'];
  const maxFileSize = 25 * 1024 * 1024; // 25MB
  const maxFiles = 100;

  if (files.length === 0) {
    errors.push('Keine Dateien ausgewählt');
  }

  if (files.length > maxFiles) {
    errors.push(`Zu viele Dateien. Maximum: ${maxFiles}`);
  }

  files.forEach((file, index) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !supportedFormats.includes(extension)) {
      errors.push(`Datei ${index + 1}: Ungültiges Format (${file.name})`);
    }

    if (file.size > maxFileSize) {
      errors.push(`Datei ${index + 1}: Zu groß (${file.name})`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
