
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/layout/PageHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import OrderProgress from '@/components/order/OrderProgress';
import OrderActionBar from '@/components/order/OrderActionBar';
import PhotoTypeStep from '@/components/order/PhotoTypeStep';
import UploadStep from '@/components/order/UploadStep';
import PackageStep from '@/components/order/PackageStep';
import ExtrasStep from '@/components/order/ExtrasStep';
import SummaryStep from '@/components/order/SummaryStep';
import ConfirmationStep from '@/components/order/ConfirmationStep';
import { validateOrderData, type OrderData } from '@/utils/orderValidation';

type Step = 'photo-type' | 'upload' | 'package' | 'extras' | 'summary' | 'confirmation';

interface ProgressStep {
  number: number;
  title: string;
  status: 'current' | 'completed' | 'upcoming';
}

const Order = () => {
  const [currentStep, setCurrentStep] = useState<Step>('photo-type');
  const [orderData, setOrderData] = useState<OrderData>({
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
  });

  const stepOrder = ['photo-type', 'upload', 'package', 'extras', 'summary'];
  
  const getStepStatus = (stepName: Step): 'current' | 'completed' | 'upcoming' => {
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepName);
    
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

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'photo-type':
        setCurrentStep('upload');
        break;
      case 'upload':
        setCurrentStep('package');
        break;
      case 'package':
        setCurrentStep('extras');
        break;
      case 'extras':
        setCurrentStep('summary');
        break;
      case 'summary':
        setCurrentStep('confirmation');
        break;
    }
  };

  const handlePrev = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('photo-type');
        break;
      case 'package':
        setCurrentStep('upload');
        break;
      case 'extras':
        setCurrentStep('package');
        break;
      case 'summary':
        setCurrentStep('extras');
        break;
      case 'confirmation':
        setCurrentStep('summary');
        break;
    }
  };

  // Check if current step can proceed
  const getCanProceed = () => {
    switch (currentStep) {
      case 'photo-type':
        return orderData.photoType !== undefined;
      case 'upload':
        return orderData.files.length > 0;
      case 'package':
        return orderData.package !== undefined;
      case 'extras':
        return true; // No validation needed for extras
      case 'summary':
        return orderData.acceptedTerms;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'photo-type':
        return (
          <PhotoTypeStep
            selectedType={orderData.photoType}
            onTypeChange={(type) => updateOrderData({ photoType: type })}
            onNext={handleNext}
          />
        );
      case 'upload':
        return (
          <UploadStep
            files={orderData.files}
            photoType={orderData.photoType}
            onFilesChange={(files) => updateOrderData({ files })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 'package':
        return (
          <PackageStep
            selectedPackage={orderData.package}
            onPackageChange={(pkg) => updateOrderData({ package: pkg })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 'extras':
        return (
          <ExtrasStep
            orderData={orderData}
            onExtrasChange={(extras) => updateOrderData({ extras })}
            onWatermarkFileChange={(watermarkFile) => updateOrderData({ watermarkFile })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            orderData={orderData}
            onUpdateData={updateOrderData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationStep
            orderData={orderData}
          />
        );
      default:
        return null;
    }
  };

  const isMobile = useIsMobile();
  
  return (
    <MobileLayout>
      {/* Mobile Compact Header with Progress */}
      {isMobile ? (
        <div className="sticky top-0 z-30 bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          {/* Thin Progress Bar */}
          <div className="w-full bg-gray-100 h-1.5">
            <div 
              className="bg-primary h-1.5 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${((stepOrder.indexOf(currentStep) + 1) / stepOrder.length) * 100}%` }}
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
                    Schritt {stepOrder.indexOf(currentStep) + 1} von {stepOrder.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Header */
        <PageHeader 
          title="Neue Bestellung" 
          subtitle="Fotos hochladen und bearbeiten lassen"
        />
      )}

      <div className={`${isMobile ? '' : 'p-6 py-[24px]'}`}>
        <div className={`${isMobile ? '' : 'max-w-4xl mx-auto space-y-8'}`}>
          {/* Desktop Progress - hidden on mobile */}
          {!isMobile && currentStep !== 'confirmation' && (
            <OrderProgress steps={steps} />
          )}
          
          {/* Step Content */}
          <div className={`${isMobile ? 'pb-32' : ''}`}>
            {renderCurrentStep()}
          </div>
        </div>
      </div>
      
      {/* Mobile Fixed Bottom Action Bar */}
      <OrderActionBar
        currentStep={currentStep}
        canProceed={getCanProceed()}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </MobileLayout>
  );
};

export default Order;
