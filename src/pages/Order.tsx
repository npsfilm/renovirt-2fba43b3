
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import OrderProgress from '@/components/order/OrderProgress';
import OrderActionBar from '@/components/order/OrderActionBar';
import PhotoTypeStep from '@/components/order/PhotoTypeStep';
import UploadStep from '@/components/order/UploadStep';
import PackageStep from '@/components/order/PackageStep';
import ExtrasStep from '@/components/order/ExtrasStep';
import SummaryStep from '@/components/order/SummaryStep';
import ConfirmationStep from '@/components/order/ConfirmationStep';
import { useOrderStore } from '@/stores/orderStore';
import { useOrderMetaStore } from '@/stores/orderMetaStore';
import { useOrderExitConfirmation } from '@/hooks/useOrderExitConfirmation';
import { OrderExitConfirmationDialog } from '@/components/order/OrderExitConfirmationDialog';

interface ProgressStep {
  number: number;
  title: string;
  status: 'current' | 'completed' | 'upcoming';
}

const Order = () => {
  const currentStep = useOrderMetaStore((state) => state.currentStep);
  const nextStep = useOrderMetaStore((state) => state.nextStep);
  const prevStep = useOrderMetaStore((state) => state.prevStep);
  const canProceedToNextStep = useOrderMetaStore((state) => state.canProceedToNextStep);
  const getStepIndex = useOrderMetaStore((state) => state.getStepIndex);
  const getProgressPercentage = useOrderMetaStore((state) => state.getProgressPercentage);

  // Exit confirmation
  const {
    showConfirmDialog,
    handleContinueOrder,
    handleExitOrder,
  } = useOrderExitConfirmation();

  const stepOrder = ['photo-type', 'upload', 'package', 'extras', 'summary'];
  
  const getStepStatus = (stepName: typeof currentStep): 'current' | 'completed' | 'upcoming' => {
    const currentIndex = getStepIndex(currentStep);
    const stepIndex = getStepIndex(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const steps: ProgressStep[] = [
    { number: 1, title: 'Foto-Typ', status: getStepStatus('photo-type') },
    { number: 2, title: 'Upload', status: getStepStatus('upload') },
    { number: 3, title: 'Paket', status: getStepStatus('package') },
    { number: 4, title: 'Extras', status: getStepStatus('extras') },
    { number: 5, title: 'Übersicht', status: getStepStatus('summary') },
  ];

  const handleNext = () => {
    if (canProceedToNextStep()) {
      nextStep();
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'photo-type':
        return <PhotoTypeStep onNext={handleNext} />;
      case 'upload':
        return <UploadStep onNext={handleNext} onPrev={handlePrev} />;
      case 'package':
        return <PackageStep onNext={handleNext} onPrev={handlePrev} />;
      case 'extras':
        return <ExtrasStep onNext={handleNext} onPrev={handlePrev} />;
      case 'summary':
        return <SummaryStep onNext={handleNext} onPrev={handlePrev} />;
      case 'confirmation':
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <MobileLayout>
        {/* Mobile Compact Header with Progress */}
        <div className="sticky top-0 z-30 bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          {/* Thin Progress Bar */}
          <div className="w-full bg-gray-100 h-1.5">
            <div 
              className="bg-primary h-1.5 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          {/* Compact Header */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentStep !== 'photo-type' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="p-2 h-9 w-9 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </Button>
                )}
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                    {steps.find(step => step.status === 'current')?.title || 'Bestellung'}
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">
                    Schritt {getStepIndex(currentStep) + 1} von {stepOrder.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="pb-32">
          {renderCurrentStep()}
        </div>
        
        {/* Mobile Fixed Bottom Action Bar */}
        <OrderActionBar
          currentStep={currentStep}
          canProceed={canProceedToNextStep()}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </MobileLayout>
    );
  }

  // Desktop Layout - Modern Airbnb-style with full viewport height and sidebar
  return (
    <>
      <SidebarProvider>
        <div className="h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
          <AppSidebar />
          <SidebarInset>
            <div className="h-screen flex flex-col">
              {/* Desktop Progress Header - Compact and Clean */}
              {currentStep !== 'confirmation' && (
                <div className="flex-shrink-0 border-b bg-card/50 backdrop-blur-sm shadow-sm">
                  <div className="max-w-4xl mx-auto px-6 py-3">
                    <OrderProgress steps={steps} />
                  </div>
                </div>
              )}
              
              {/* Main Content Area - Scrollable */}
              <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-6 py-4">
                  <div className="min-h-full flex flex-col justify-center">
                    {renderCurrentStep()}
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>

      {/* Exit Confirmation Dialog */}
      <OrderExitConfirmationDialog
        open={showConfirmDialog}
        onContinue={handleContinueOrder}
        onExit={handleExitOrder}
      />
    </>
  );
};

export default Order;
