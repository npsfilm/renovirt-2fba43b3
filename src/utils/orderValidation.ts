
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
  watermarkFile?: File;
}

export const validateOrderFiles = (files: File[]) => {
  const errors: string[] = [];
  const supportedFormats = ['jpg', 'jpeg', 'png', 'cr2', 'cr3', 'nef', 'arw', 'dng', 'zip'];
  const maxFileSize = 25 * 1024 * 1024; // 25MB
  const maxFiles = 100;

  if (files.length === 0) {
    errors.push('Mindestens eine Datei muss hochgeladen werden');
  }

  if (files.length > maxFiles) {
    errors.push(`Maximal ${maxFiles} Dateien erlaubt`);
  }

  files.forEach((file, index) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !supportedFormats.includes(extension)) {
      errors.push(`Datei ${index + 1}: Ungültiges Format (${extension})`);
    }

    if (file.size > maxFileSize) {
      errors.push(`Datei ${index + 1}: Zu groß (max 25MB)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateEffectiveImageCount = (files: File[], photoType?: string): number => {
  if (photoType === 'bracketing-3') {
    return Math.floor(files.length / 3);
  } else if (photoType === 'bracketing-5') {
    return Math.floor(files.length / 5);
  }
  return files.length;
};
