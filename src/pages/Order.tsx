
import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/layout/PageHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import OrderActionBar from '@/components/order/OrderActionBar';
import OrderProgressBar from '@/components/order/OrderProgressBar';
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

  const getStepStatus = (stepName: Step): 'current' | 'completed' | 'upcoming' => {
    const stepOrder = ['photo-type', 'upload', 'package', 'extras', 'summary'];
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

  // Calculate if we can proceed (for action bar)
  const canProceed = () => {
    switch (currentStep) {
      case 'photo-type':
        return !!orderData.photoType;
      case 'upload':
        return orderData.files.length > 0;
      case 'package':
        return !!orderData.package;
      case 'extras':
        return true; // Extras are optional
      case 'summary':
        return !!(orderData.photoType && orderData.files.length > 0 && orderData.package && orderData.email && orderData.acceptedTerms);
      default:
        return false;
    }
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'photo-type':
        return (
          <PhotoTypeStep
            selectedType={orderData.photoType}
            onTypeChange={(type) => updateOrderData({ photoType: type })}
          />
        );
      case 'upload':
        return (
          <UploadStep
            files={orderData.files}
            photoType={orderData.photoType}
            onFilesChange={(files) => updateOrderData({ files })}
          />
        );
      case 'package':
        return (
          <PackageStep
            selectedPackage={orderData.package}
            onPackageChange={(pkg) => updateOrderData({ package: pkg })}
          />
        );
      case 'extras':
        return (
          <ExtrasStep
            orderData={orderData}
            onExtrasChange={(extras) => updateOrderData({ extras })}
            onWatermarkFileChange={(watermarkFile) => updateOrderData({ watermarkFile })}
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
      <OrderProgressBar currentStep={currentStep} />
      
      {!isMobile && (
        <PageHeader 
          title="Neue Bestellung" 
          subtitle="Fotos hochladen und bearbeiten lassen"
        />
      )}
      <div className="pb-32 pt-1">
        <div className="max-w-2xl mx-auto">
          {isMobile && (
            <div className="mb-6 px-4 pt-2">
              <h1 className="text-2xl font-semibold text-foreground">Neue Bestellung</h1>
              <p className="text-muted-foreground">Fotos hochladen und bearbeiten lassen</p>
            </div>
          )}
          {renderCurrentStep()}
        </div>
      </div>

      <OrderActionBar
        currentStep={currentStep}
        canProceed={canProceed()}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </MobileLayout>
  );
};

export default Order;
