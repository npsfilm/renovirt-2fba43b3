import { useMemo } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { calculateEffectiveImageCount, validateOrderData } from '@/utils/orderValidation';

export const useEffectiveImageCount = () => {
  const files = useOrderStore((state) => state.files);
  const photoType = useOrderStore((state) => state.photoType);
  
  return useMemo(() => {
    return calculateEffectiveImageCount(files, photoType);
  }, [files, photoType]);
};

export const useOrderValidation = () => {
  const orderData = useOrderStore((state) => ({
    photoType: state.photoType,
    files: state.files,
    package: state.package,
    extras: state.extras,
    watermarkFile: state.watermarkFile,
    email: state.email,
    acceptedTerms: state.acceptedTerms,
    company: state.company,
    objectReference: state.objectReference,
    specialRequests: state.specialRequests,
  }));
  
  return useMemo(() => {
    return validateOrderData(orderData);
  }, [orderData]);
};