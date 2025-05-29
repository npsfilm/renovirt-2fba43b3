import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import UploadStep from '@/components/order/UploadStep';
import PackageStep from '@/components/order/PackageStep';
import SummaryStep from '@/components/order/SummaryStep';
import ConfirmationStep from '@/components/order/ConfirmationStep';
import OrderProgress from '@/components/order/OrderProgress';

interface OrderData {
  photoType?: string;
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  couponCode?: string;
  acceptedTerms: boolean;
}

const OrderFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    files: [],
    extras: {
      express: false,
      upscale: false,
      watermark: false,
    },
    acceptedTerms: false,
  });

  const steps = [
    { 
      number: 1, 
      title: 'Upload', 
      status: (currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      number: 2, 
      title: 'Paket', 
      status: (currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      number: 3, 
      title: 'Übersicht', 
      status: (currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      number: 4, 
      title: 'Bestätigung', 
      status: (currentStep === 4 ? 'completed' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
  ];

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UploadStep
            files={orderData.files}
            onFilesChange={(files) => updateOrderData({ files })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <PackageStep
            selectedPackage={orderData.package}
            onPackageChange={(pkg) => updateOrderData({ package: pkg })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <SummaryStep
            orderData={orderData}
            onUpdateData={updateOrderData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return <ConfirmationStep orderData={orderData} />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Bestellflow</h1>
          </header>
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <OrderProgress steps={steps} />
              <div className="mt-8">
                {renderStep()}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OrderFlow;
