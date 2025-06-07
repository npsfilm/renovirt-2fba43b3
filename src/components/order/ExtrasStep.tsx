
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Zap, Star, Droplets } from 'lucide-react';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import type { OrderData } from '@/utils/orderValidation';

interface ExtrasStepProps {
  orderData: OrderData;
  onExtrasChange: (extras: OrderData['extras']) => void;
  onWatermarkFileChange: (file: File | undefined) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Net prices per image for extras (result in 2.00€ gross with 19% VAT)
const EXTRA_NET_PRICE = 1.68;
const EXTRA_GROSS_PRICE = 2.00;

const ExtrasStep = ({ 
  orderData, 
  onExtrasChange, 
  onWatermarkFileChange,
  onNext, 
  onPrev 
}: ExtrasStepProps) => {
  const [dragOver, setDragOver] = useState(false);
  
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  
  const calculateExtraPrice = () => {
    return (EXTRA_GROSS_PRICE * imageCount).toFixed(2);
  };

  const calculateExtraNetPrice = () => {
    return (EXTRA_NET_PRICE * imageCount).toFixed(2);
  };

  const handleExtraChange = (extraName: keyof OrderData['extras'], checked: boolean) => {
    const newExtras = { ...orderData.extras, [extraName]: checked };
    onExtrasChange(newExtras);
    
    // Reset watermark file if watermark extra is disabled
    if (extraName === 'watermark' && !checked) {
      onWatermarkFileChange(undefined);
    }
  };

  const handleWatermarkUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      onWatermarkFileChange(file);
    } else {
      alert('Bitte wählen Sie eine Bilddatei aus.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleWatermarkUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleWatermarkUpload(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Extras wählen</h2>
        <p className="text-muted-foreground">
          Wählen Sie zusätzliche Services für Ihre Bestellung ({imageCount} Bilder)
        </p>
      </div>

      <div className="grid gap-4">
        {/* 4K Upscale */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="upscale"
                checked={orderData.extras.upscale}
                onCheckedChange={(checked) => handleExtraChange('upscale', checked as boolean)}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <Label htmlFor="upscale" className="text-lg font-semibold cursor-pointer">
                    4K Upscale
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hochauflösende 4K-Qualität für gestochen scharfe Bilder
                </p>
                <p className="text-sm font-medium">
                  {EXTRA_GROSS_PRICE.toFixed(2)}€ pro Bild (Gesamt: {calculateExtraPrice()}€ inkl. MwSt.)
                </p>
                <p className="text-xs text-muted-foreground">
                  Netto: {EXTRA_NET_PRICE.toFixed(2)}€ pro Bild (Gesamt: {calculateExtraNetPrice()}€ netto)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 24h Express Delivery */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="express"
                checked={orderData.extras.express}
                onCheckedChange={(checked) => handleExtraChange('express', checked as boolean)}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <Label htmlFor="express" className="text-lg font-semibold cursor-pointer">
                    24h Express-Lieferung
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ihre bearbeiteten Bilder in nur 24 Stunden
                </p>
                <p className="text-sm font-medium">
                  {EXTRA_GROSS_PRICE.toFixed(2)}€ pro Bild (Gesamt: {calculateExtraPrice()}€ inkl. MwSt.)
                </p>
                <p className="text-xs text-muted-foreground">
                  Netto: {EXTRA_NET_PRICE.toFixed(2)}€ pro Bild (Gesamt: {calculateExtraNetPrice()}€ netto)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Watermark */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="watermark"
                checked={orderData.extras.watermark}
                onCheckedChange={(checked) => handleExtraChange('watermark', checked as boolean)}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <Label htmlFor="watermark" className="text-lg font-semibold cursor-pointer">
                    Eigenes Wasserzeichen
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fügen Sie Ihr eigenes Logo oder Wasserzeichen hinzu
                </p>
                <p className="text-sm font-medium">
                  {EXTRA_GROSS_PRICE.toFixed(2)}€ pro Bild (Gesamt: {calculateExtraPrice()}€ inkl. MwSt.)
                </p>
                <p className="text-xs text-muted-foreground">
                  Netto: {EXTRA_NET_PRICE.toFixed(2)}€ pro Bild (Gesamt: {calculateExtraNetPrice()}€ netto)
                </p>
                
                {/* Watermark Upload Field */}
                {orderData.extras.watermark && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-medium">Wasserzeichen-Datei hochladen</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                    >
                      {orderData.watermarkFile ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-green-600">
                            ✓ {orderData.watermarkFile.name}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onWatermarkFileChange(undefined)}
                          >
                            Datei entfernen
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Wasserzeichen-Datei hier hinziehen oder
                          </p>
                          <Label htmlFor="watermark-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" asChild>
                              <span>Datei auswählen</span>
                            </Button>
                          </Label>
                          <Input
                            id="watermark-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileInput}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unterstützte Formate: PNG, JPG, SVG (transparent empfohlen)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Zurück
        </Button>
        <Button onClick={onNext}>
          Weiter zur Übersicht
        </Button>
      </div>
    </div>
  );
};

export default ExtrasStep;
