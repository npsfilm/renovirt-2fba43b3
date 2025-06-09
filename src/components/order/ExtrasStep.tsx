
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Upload, Zap, Image } from 'lucide-react';
import type { OrderData } from '@/utils/orderValidation';

interface ExtrasStepProps {
  orderData: OrderData;
  onExtrasChange: (extras: OrderData['extras']) => void;
  onWatermarkFileChange: (file: File | undefined) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ExtrasStep = ({
  orderData,
  onExtrasChange,
  onWatermarkFileChange,
  onNext,
  onPrev
}: ExtrasStepProps) => {
  const extras = [
    {
      id: 'upscale' as keyof OrderData['extras'],
      icon: Image,
      title: 'Upscaling',
      description: 'Vergrößerung der Bildauflösung um das 2-fache',
      price: '2,00€',
      enabled: orderData.extras.upscale
    },
    {
      id: 'express' as keyof OrderData['extras'],
      icon: Zap,
      title: 'Express-Bearbeitung',
      description: 'Prioritäre Bearbeitung innerhalb von 24 Stunden',
      price: '2,00€',
      enabled: orderData.extras.express
    },
    {
      id: 'watermark' as keyof OrderData['extras'],
      icon: Upload,
      title: 'Eigenes Wasserzeichen',
      description: 'Upload Ihres eigenen Logos/Wasserzeichens',
      price: '2,00€',
      enabled: orderData.extras.watermark
    }
  ];

  const handleExtraToggle = (extraId: keyof OrderData['extras']) => {
    onExtrasChange({
      ...orderData.extras,
      [extraId]: !orderData.extras[extraId]
    });
  };

  const handleWatermarkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onWatermarkFileChange(file);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Zusätzliche Services
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Erweitern Sie Ihre Bestellung mit unseren professionellen Zusatzservices.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="grid gap-4">
          {extras.map(extra => (
            <Card 
              key={extra.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                extra.enabled ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handleExtraToggle(extra.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                      <extra.icon className="w-6 h-6 text-foreground stroke-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground">{extra.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {extra.price}/pro Bild
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{extra.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={extra.enabled}
                    onCheckedChange={() => handleExtraToggle(extra.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orderData.extras.watermark && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Wasserzeichen-Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Laden Sie Ihr Logo oder Wasserzeichen hoch (PNG, JPG, max. 5MB)
              </p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWatermarkUpload}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {orderData.watermarkFile && (
                  <p className="text-sm text-success">
                    Datei ausgewählt: {orderData.watermarkFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Alle Preise sind zzgl. 19% MwSt.
      </div>

      <div className="flex justify-between max-w-2xl mx-auto">
        <Button variant="outline" onClick={onPrev} className="shadow-sm">
          ← Zurück zu Paket
        </Button>
        <Button onClick={onNext} className="min-w-[150px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
          Weiter zur Übersicht →
        </Button>
      </div>
    </div>
  );
};

export default ExtrasStep;
