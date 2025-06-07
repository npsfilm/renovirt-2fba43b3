
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrderProgress from '@/components/order/OrderProgress';
import PackageStep from '@/components/order/PackageStep';
import PhotoTypeStep from '@/components/order/PhotoTypeStep';
import UploadStep from '@/components/order/UploadStep';
import ExtrasStep from '@/components/order/ExtrasStep';
import SummaryStep from '@/components/order/SummaryStep';
import ConfirmationStep from '@/components/order/ConfirmationStep';
import { validateOrderData, type OrderData } from '@/utils/orderValidation';
import { useToast } from '@/hooks/use-toast';

const OrderFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const { toast } = useToast();

  const [orderData, setOrderData] = useState<OrderData>({
    package: undefined,
    photoType: undefined,
    files: [],
    extras: {
      express: false,
      upscale: false,
      watermark: false,
    },
    acceptedTerms: false,
  });

  const steps = [
    { number: 1, title: 'Paket wählen', status: !!orderData.package ? 'completed' : currentStep === 1 ? 'current' : 'upcoming' },
    { number: 2, title: 'Foto-Typ', status: !!orderData.photoType ? 'completed' : currentStep === 2 ? 'current' : 'upcoming' },
    { number: 3, title: 'Bilder hochladen', status: orderData.files.length > 0 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming' },
    { number: 4, title: 'Extras', status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming' },
    { number: 5, title: 'Zusammenfassung', status: orderData.acceptedTerms ? 'completed' : currentStep === 5 ? 'current' : 'upcoming' },
    { number: 6, title: 'Bestätigung', status: currentStep === 6 ? 'current' : 'upcoming' },
  ] as const;

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...updates }));
  };

  const goToNext = (createdOrderData?: any) => {
    if (createdOrderData) {
      setCreatedOrder(createdOrderData);
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const goToPrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return !!orderData.package;
      case 2:
        return !!orderData.photoType;
      case 3:
        return orderData.files.length > 0;
      case 4:
        return true;
      case 5:
        const validation = validateOrderData(orderData);
        if (!validation.isValid) {
          toast({
            title: "Unvollständige Angaben",
            description: validation.errors[0],
            variant: "destructive",
          });
          return false;
        }
        return orderData.acceptedTerms;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PackageStep
            selectedPackage={orderData.package}
            onPackageChange={(pkg) => updateOrderData({ package: pkg })}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 2:
        return (
          <PhotoTypeStep
            selectedType={orderData.photoType}
            onTypeChange={(type) => updateOrderData({ photoType: type })}
            onNext={goToNext}
          />
        );
      case 3:
        return (
          <UploadStep
            files={orderData.files}
            photoType={orderData.photoType}
            onFilesChange={(files) => updateOrderData({ files })}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 4:
        return (
          <ExtrasStep
            orderData={orderData}
            onExtrasChange={(extras) => updateOrderData({ extras })}
            onWatermarkFileChange={(file) => updateOrderData({ watermarkFile: file })}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 5:
        return (
          <SummaryStep
            orderData={orderData}
            onUpdateData={updateOrderData}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 6:
        return (
          <ConfirmationStep
            orderData={orderData}
            createdOrder={createdOrder}
            orderNumber={createdOrder?.order_number}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Ihre Immobilienbilder perfekt bearbeitet
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              In wenigen Schritten zu professionellen HDR-Bildern
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <OrderProgress steps={[...steps]} />
          </div>

          {/* Main Content Card */}
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 md:p-6 lg:p-8">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderFlow;
