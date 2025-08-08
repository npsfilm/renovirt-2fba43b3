import { create } from 'zustand';
import { useOrderStore, type OrderStep } from './orderStore';

interface OrderMetaState {
  currentStep: OrderStep;
  isProcessing: boolean;
  processingStep?: string;
  
  // Navigation
  setCurrentStep: (step: OrderStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Processing state
  setProcessing: (isProcessing: boolean, step?: string) => void;
  
  // Step validation
  canProceedToNextStep: () => boolean;
  
  // Helper methods
  getStepIndex: (step: OrderStep) => number;
  getProgressPercentage: () => number;
}

const stepOrder: OrderStep[] = ['photo-type', 'upload', 'package', 'extras', 'summary'];

export const useOrderMetaStore = create<OrderMetaState>((set, get) => ({
  currentStep: 'photo-type',
  isProcessing: false,
  processingStep: undefined,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      set({ currentStep: nextStep });
    } else if (currentStep === 'summary') {
      set({ currentStep: 'confirmation' });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    
    if (currentStep === 'confirmation') {
      set({ currentStep: 'summary' });
      return;
    }
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1];
      set({ currentStep: prevStep });
    }
  },

  setProcessing: (isProcessing, step) => 
    set({ isProcessing, processingStep: step }),

  canProceedToNextStep: () => {
    const { currentStep } = get();
    
    // Zugriff auf Order-Store ohne require
    const orderState = useOrderStore.getState();
    
    switch (currentStep) {
      case 'photo-type':
        return orderState.photoType !== undefined;
      case 'upload':
        return orderState.files.length > 0;
      case 'package':
        return orderState.package !== undefined;
      case 'extras':
        return true;
      case 'summary':
        return orderState.acceptedTerms;
      default:
        return false;
    }
  },

  getStepIndex: (step) => {
    if (step === 'confirmation') return stepOrder.length;
    return stepOrder.indexOf(step);
  },

  getProgressPercentage: () => {
    const { currentStep } = get();
    const currentIndex = get().getStepIndex(currentStep);
    return ((currentIndex + 1) / stepOrder.length) * 100;
  },
}));