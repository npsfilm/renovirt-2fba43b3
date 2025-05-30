import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PhotoTypeStep from '@/components/order/PhotoTypeStep';
import UploadStep from '@/components/order/UploadStep';
import PackageStep from '@/components/order/PackageStep';
import SummaryStep from '@/components/order/SummaryStep';
import ConfirmationStep from '@/components/order/ConfirmationStep';
import OrderProgress from '@/components/order/OrderProgress';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OrderData {
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
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
  watermarkFile?: File;
}

const OrderFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  
  // Fetch customer profile data
  const { data: profile } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });
  
  const [orderData, setOrderData] = useState<OrderData>({
    files: [],
    extras: {
      express: false,
      upscale: false,
      watermark: false,
    },
    acceptedTerms: false,
  });

  // Auto-fill email when user or profile data is available
  useEffect(() => {
    if (user?.email && !orderData.email) {
      setOrderData(prev => ({ ...prev, email: user.email }));
    } else if (profile?.billing_email && !orderData.email) {
      setOrderData(prev => ({ ...prev, email: profile.billing_email }));
    }
  }, [user, profile, orderData.email]);

  const steps = [
    { 
      number: 1, 
      title: 'Typ wählen', 
      status: (currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      number: 2, 
      title: 'Upload', 
      status: (currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      number: 3, 
      title: 'Paket', 
      status: (currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      number: 4, 
      title: 'Übersicht', 
      status: (currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      number: 5, 
      title: 'Bestätigung', 
      status: (currentStep === 5 ? 'completed' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
  ];

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
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
          <PhotoTypeStep
            selectedType={orderData.photoType}
            onTypeChange={(type) => updateOrderData({ photoType: type })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <UploadStep
            files={orderData.files}
            photoType={orderData.photoType}
            onFilesChange={(files) => updateOrderData({ files })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <PackageStep
            selectedPackage={orderData.package}
            onPackageChange={(pkg) => updateOrderData({ package: pkg })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <SummaryStep
            orderData={orderData}
            onUpdateData={updateOrderData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
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
