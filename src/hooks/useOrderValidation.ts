import { useMemo } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { useOrderMetaStore } from '@/stores/orderMetaStore';
import type { OrderStep } from '@/stores/orderStore';

export const useOrderValidation = () => {
  const currentStep = useOrderMetaStore((state) => state.currentStep);
  const photoType = useOrderStore((state) => state.photoType);
  const files = useOrderStore((state) => state.files);
  const packageType = useOrderStore((state) => state.package);
  const acceptedTerms = useOrderStore((state) => state.acceptedTerms);

  const canProceedToNextStep = useMemo(() => {
    switch (currentStep) {
      case 'photo-type':
        return photoType !== undefined;
      case 'upload':
        return files.length > 0;
      case 'package':
        return packageType !== undefined;
      case 'extras':
        return true;
      case 'summary':
        return acceptedTerms;
      default:
        return false;
    }
  }, [currentStep, photoType, files.length, packageType, acceptedTerms]);

  return {
    canProceedToNextStep,
  };
};