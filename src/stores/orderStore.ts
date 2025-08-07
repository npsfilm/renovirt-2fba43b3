import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateEffectiveImageCount, validateOrderData, type OrderData } from '@/utils/orderValidation';

export type OrderStep = 'photo-type' | 'upload' | 'package' | 'extras' | 'summary' | 'confirmation';

interface OrderState extends OrderData {
  // Computed values
  effectiveImageCount: number;
  isValid: boolean;
  
  // Actions
  setPhotoType: (photoType: OrderData['photoType']) => void;
  setFiles: (files: File[]) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  setPackage: (pkg: OrderData['package']) => void;
  setExtras: (extras: Partial<OrderData['extras']>) => void;
  setWatermarkFile: (file: File | undefined) => void;
  setEmail: (email: string) => void;
  setCompany: (company: string) => void;
  setObjectReference: (reference: string) => void;
  setSpecialRequests: (requests: string) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  updateOrderData: (updates: Partial<OrderData>) => void;
  resetOrder: () => void;
  
  // Internal helper
  _computeValues: () => void;
}

const initialOrderData: OrderData = {
  photoType: undefined,
  files: [],
  package: undefined,
  extras: {
    upscale: false,
    express: false,
    watermark: false,
  },
  watermarkFile: undefined,
  email: '',
  acceptedTerms: false,
  company: '',
  objectReference: '',
  specialRequests: '',
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      ...initialOrderData,
      effectiveImageCount: 0,
      isValid: false,

      _computeValues: () => {
        const state = get();
        const effectiveImageCount = calculateEffectiveImageCount(state.files, state.photoType);
        const isValid = validateOrderData(state);
        
        set({
          effectiveImageCount,
          isValid,
        });
      },

      setPhotoType: (photoType) => {
        set({ photoType });
        get()._computeValues();
      },

      setFiles: (files) => {
        set({ files });
        get()._computeValues();
      },

      addFiles: (newFiles) => {
        const currentFiles = get().files;
        const uniqueNewFiles = newFiles.filter(
          (newFile) => !currentFiles.some((existing) => 
            existing.name === newFile.name && existing.size === newFile.size
          )
        );
        set({ files: [...currentFiles, ...uniqueNewFiles] });
        get()._computeValues();
      },

      removeFile: (index) => {
        const files = get().files.filter((_, i) => i !== index);
        set({ files });
        get()._computeValues();
      },

      setPackage: (pkg) => {
        set({ package: pkg });
        get()._computeValues();
      },

      setExtras: (newExtras) => {
        const currentExtras = get().extras;
        set({ extras: { ...currentExtras, ...newExtras } });
        get()._computeValues();
      },

      setWatermarkFile: (watermarkFile) => {
        set({ watermarkFile });
        get()._computeValues();
      },

      setEmail: (email) => {
        set({ email });
        get()._computeValues();
      },

      setCompany: (company) => {
        set({ company });
        get()._computeValues();
      },

      setObjectReference: (objectReference) => {
        set({ objectReference });
        get()._computeValues();
      },

      setSpecialRequests: (specialRequests) => {
        set({ specialRequests });
        get()._computeValues();
      },

      setAcceptedTerms: (acceptedTerms) => {
        set({ acceptedTerms });
        get()._computeValues();
      },

      updateOrderData: (updates) => {
        set((state) => ({ ...state, ...updates }));
        get()._computeValues();
      },

      resetOrder: () => {
        set({
          ...initialOrderData,
          effectiveImageCount: 0,
          isValid: false,
        });
      },
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        // Persist everything except computed values and functions
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
      }),
      onRehydrateStorage: () => (state) => {
        // Recompute values after hydrating from storage
        if (state) {
          state._computeValues();
        }
      },
    }
  )
);