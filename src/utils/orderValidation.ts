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
