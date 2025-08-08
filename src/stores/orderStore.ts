import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateEffectiveImageCount, validateOrderData, type OrderData } from '@/utils/orderValidation';
import posthog from 'posthog-js';

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
        
        // Only update if values actually changed to prevent infinite loops
        if (state.effectiveImageCount !== effectiveImageCount || state.isValid !== isValid) {
          set({
            effectiveImageCount,
            isValid,
          });
        }
      },

      setPhotoType: (photoType) => {
        set({ photoType });
        get()._computeValues();
        
        // PostHog: Track photo type selection
        posthog.capture('order_step_completed', {
          step: 'photo_type',
          photo_type: photoType,
          step_number: 1
        });
      },

      setFiles: (files) => {
        set({ files });
        get()._computeValues();
        
        // PostHog: Track file upload completion
        posthog.capture('order_step_completed', {
          step: 'upload',
          file_count: files.length,
          step_number: 2,
          total_file_size: files.reduce((sum, file) => sum + file.size, 0)
        });
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
        
        // PostHog: Track files added during upload
        if (uniqueNewFiles.length > 0) {
          posthog.capture('files_added_to_order', {
            new_files_count: uniqueNewFiles.length,
            total_files_count: currentFiles.length + uniqueNewFiles.length,
            file_types: uniqueNewFiles.map(f => f.type).filter(Boolean)
          });
        }
      },

      removeFile: (index) => {
        const files = get().files.filter((_, i) => i !== index);
        set({ files });
        get()._computeValues();
      },

      setPackage: (pkg) => {
        set({ package: pkg });
        get()._computeValues();
        
        // PostHog: Track package selection
        if (pkg) {
          posthog.capture('order_step_completed', {
            step: 'package',
            package_selected: pkg,
            step_number: 3
          });
        }
      },

      setExtras: (newExtras) => {
        const currentExtras = get().extras;
        const updatedExtras = { ...currentExtras, ...newExtras };
        set({ extras: updatedExtras });
        get()._computeValues();
        
        // PostHog: Track extras selection
        posthog.capture('order_step_completed', {
          step: 'extras',
          extras_selected: Object.keys(newExtras).filter(key => newExtras[key]),
          total_extras: Object.values(updatedExtras).filter(Boolean).length,
          step_number: 4
        });
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
        // PostHog: Track order reset/abandonment
        const currentState = get();
        posthog.capture('order_abandoned', {
          last_step: currentState.photoType ? 
            (currentState.files.length > 0 ? 
              (currentState.package ? 'package_selected' : 'files_uploaded') 
              : 'photo_type_selected') 
            : 'not_started',
          files_count: currentState.files.length,
          had_package: !!currentState.package
        });
        
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