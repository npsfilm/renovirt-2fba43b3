
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import OrderProgress from '@/components/order/OrderProgress';
import PhotoTypeStep from '@/components/order/PhotoTypeStep';
import UploadStep from '@/components/order/UploadStep';
import PackageStep from '@/components/order/PackageStep';
import ExtrasStep from '@/components/order/ExtrasStep';
import SummaryStep from '@/components/order/SummaryStep';
import ConfirmationStep from '@/components/order/ConfirmationStep';
import { validateOrderData, type OrderData } from '@/utils/orderValidation';

type Step = 'photo-type' | 'upload' | 'package' | 'extras' | 'summary' | 'confirmation';

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
  });

  const steps = [
    { number: 1, title: 'Foto-Typ', status: currentStep === 'photo-type' ? 'current' : 'completed' as const },
    { number: 2, title: 'Upload', status: currentStep === 'upload' ? 'current' : (currentStep === 'photo-type' ? 'upcoming' : 'completed') as const },
    { number: 3, title: 'Paket', status: currentStep === 'package' ? 'current' : (['photo-type', 'upload'].includes(currentStep) ? 'upcoming' : 'completed') as const },
    { number: 4, title: 'Extras', status: currentStep === 'extras' ? 'current' : (['photo-type', 'upload', 'package'].includes(currentStep) ? 'upcoming' : 'completed') as const },
    { number: 5, title: 'Übersicht', status: currentStep === 'summary' ? 'current' : (['photo-type', 'upload', 'package', 'extras'].includes(currentStep) ? 'upcoming' : 'completed') as const },
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
            onStartNewOrder={() => {
              setCurrentStep('photo-type');
              setOrderData({
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
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Neue Bestellung" 
            subtitle="Fotos hochladen und bearbeiten lassen"
          />
          <main className="flex-1 p-6 py-[24px]">
            <div className="max-w-4xl mx-auto space-y-8">
              {currentStep !== 'confirmation' && (
                <OrderProgress steps={steps} />
              )}
              {renderCurrentStep()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Order;
