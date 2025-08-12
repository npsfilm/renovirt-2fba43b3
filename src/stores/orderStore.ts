import { create } from 'zustand';
import { calculateEffectiveImageCount, validateOrderData, type OrderData } from '@/utils/orderValidation';
import posthog from 'posthog-js';

export type OrderStep = 'photo-type' | 'upload' | 'package' | 'extras' | 'summary' | 'confirmation';

interface OrderState extends OrderData {
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

export const useOrderStore = create<OrderState>()((set, get) => ({
  ...initialOrderData,

  setPhotoType: (photoType) => {
    set({ photoType });
    
    // PostHog: Track photo type selection
    posthog.capture('order_step_completed', {
      step: 'photo_type',
      photo_type: photoType,
      step_number: 1
    });
  },

  setFiles: (files) => {
    set({ files });
    
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
  },

  setPackage: (pkg) => {
    set({ package: pkg });
    
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
  },

  setEmail: (email) => {
    set({ email });
  },

  setCompany: (company) => {
    set({ company });
  },

  setObjectReference: (objectReference) => {
    set({ objectReference });
  },

  setSpecialRequests: (specialRequests) => {
    set({ specialRequests });
  },

  setAcceptedTerms: (acceptedTerms) => {
    set({ acceptedTerms });
  },

  updateOrderData: (updates) => {
    console.log('updateOrderData called with:', updates, 'Stack:', new Error().stack);
    set((state) => {
      // Deep comparison for arrays and objects
      const hasChanges = Object.keys(updates).some(key => {
        const currentValue = state[key];
        const newValue = updates[key];
        
        // Handle array comparison (for files)
        if (Array.isArray(currentValue) && Array.isArray(newValue)) {
          const arrayChanged = currentValue.length !== newValue.length || 
                 currentValue.some((item, index) => item !== newValue[index]);
          if (arrayChanged) {
            console.log(`Array change detected for ${key}:`, { current: currentValue, new: newValue });
          }
          return arrayChanged;
        }
        
        // Handle object comparison (for extras, etc.)
        if (typeof currentValue === 'object' && typeof newValue === 'object' && 
            currentValue !== null && newValue !== null) {
          const currentKeys = Object.keys(currentValue);
          const newKeys = Object.keys(newValue);
          const objectChanged = currentKeys.length !== newKeys.length ||
                 currentKeys.some(k => currentValue[k] !== newValue[k]);
          if (objectChanged) {
            console.log(`Object change detected for ${key}:`, { current: currentValue, new: newValue });
          }
          return objectChanged;
        }
        
        // Handle primitive comparison
        const primitiveChanged = currentValue !== newValue;
        if (primitiveChanged) {
          console.log(`Primitive change detected for ${key}:`, { current: currentValue, new: newValue });
        }
        return primitiveChanged;
      });
      
      if (!hasChanges) {
        console.log('No changes detected, returning same state object');
        return state; // Return the same state object to prevent re-renders
      }
      
      console.log('Changes detected, updating order data');
      return { ...state, ...updates };
    });
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
    });
  },
}));