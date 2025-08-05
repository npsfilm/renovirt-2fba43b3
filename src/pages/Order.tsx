
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
  
  if (isMobile) {
    // Mobile layout - keep existing design
    return (
      <MobileLayout>
        {/* Mobile Compact Header with Progress */}
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

        {/* Step Content */}
        <div className="pb-32">
          {renderCurrentStep()}
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
  }

  // Desktop layout - Modern Airbnb-style split screen
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar - Progress & Navigation */}
      {currentStep !== 'confirmation' && (
        <div className="w-80 bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              {currentStep !== 'photo-type' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  className="p-2 h-9 w-9 rounded-full hover:bg-muted transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                  Neue Bestellung
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fotos hochladen und bearbeiten lassen
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Progress */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step.status === 'completed'
                          ? 'bg-success text-success-foreground'
                          : step.status === 'current'
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <div className="w-4 h-4 rounded-full bg-success-foreground" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 mt-2 transition-all duration-500 ${
                          step.status === 'completed' ? 'bg-success' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3
                      className={`text-sm font-medium transition-colors duration-300 ${
                        step.status === 'current' 
                          ? 'text-primary' 
                          : step.status === 'completed'
                          ? 'text-success'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {step.status === 'current' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Aktueller Schritt
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Content Area */}
      <div className={`flex-1 flex flex-col ${currentStep === 'confirmation' ? 'w-full' : ''}`}>
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="h-full flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
              {renderCurrentStep()}
            </div>
          </div>
        </div>

        {/* Bottom Actions - only show if not confirmation */}
        {currentStep !== 'confirmation' && (
          <div className="border-t border-border bg-card p-6">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <div>
                {currentStep !== 'photo-type' && (
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="px-6"
                  >
                    Zurück
                  </Button>
                )}
              </div>
              <Button
                onClick={handleNext}
                disabled={!getCanProceed()}
                className="px-8"
              >
                {currentStep === 'summary' ? 'Bestellen' : 'Weiter'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
