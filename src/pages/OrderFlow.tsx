import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OrderProgress } from '@/components/order/OrderProgress';
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
    { id: 1, title: 'Paket wählen', completed: !!orderData.package },
    { id: 2, title: 'Foto-Typ', completed: !!orderData.photoType },
    { id: 3, title: 'Bilder hochladen', completed: orderData.files.length > 0 },
    { id: 4, title: 'Extras', completed: true },
    { id: 5, title: 'Zusammenfassung', completed: orderData.acceptedTerms },
    { id: 6, title: 'Bestätigung', completed: false },
  ];

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
            onPackageSelect={(pkg) => updateOrderData({ package: pkg })}
            onNext={goToNext}
          />
        );
      case 2:
        return (
          <PhotoTypeStep
            selectedType={orderData.photoType}
            onTypeSelect={(type) => updateOrderData({ photoType: type })}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 3:
        return (
          <UploadStep
            files={orderData.files}
            photoType={orderData.photoType}
            onFilesUpdate={(files) => updateOrderData({ files })}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        );
      case 4:
        return (
          <ExtrasStep
            orderData={orderData}
            onUpdateData={updateOrderData}
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Ihre Immobilienbilder perfekt bearbeitet
            </h1>
            <p className="text-muted-foreground">
              In wenigen Schritten zu professionellen HDR-Bildern
            </p>
          </div>

          <OrderProgress steps={steps} currentStep={currentStep} />

          <Card className="mt-8">
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderFlow;
