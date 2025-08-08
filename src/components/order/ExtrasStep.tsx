
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Upload, Zap, Image } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';

interface ExtrasStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const ExtrasStep = ({ onNext, onPrev }: ExtrasStepProps) => {
  // Separate selectors to minimize re-renders
  const extras = useOrderStore((state) => state.extras);
  const watermarkFile = useOrderStore((state) => state.watermarkFile);
  const setExtras = useOrderStore((state) => state.setExtras);
  const setWatermarkFile = useOrderStore((state) => state.setWatermarkFile);
  
  // Memoize extras configuration to prevent recreations
  const extrasConfig = React.useMemo(() => [
    {
      id: 'upscale' as const,
      icon: Image,
      title: 'Upscaling',
      description: 'Vergrößerung der Bildauflösung um das 2-fache',
      price: '2,00€',
      enabled: extras.upscale
    },
    {
      id: 'express' as const,
      icon: Zap,
      title: 'Express-Bearbeitung',
      description: 'Prioritäre Bearbeitung innerhalb von 24 Stunden',
      price: '2,00€',
      enabled: extras.express
    },
    {
      id: 'watermark' as const,
      icon: Upload,
      title: 'Eigenes Wasserzeichen',
      description: 'Upload Ihres eigenen Logos/Wasserzeichens',
      price: '2,00€',
      enabled: extras.watermark
    }
  ], [extras.upscale, extras.express, extras.watermark]);

  // Memoize handlers to prevent recreation
  const handleExtraToggle = React.useCallback((extraId: 'upscale' | 'express' | 'watermark') => {
    setExtras({
      [extraId]: !extras[extraId]
    });
  }, [extras, setExtras]);

  const handleWatermarkUpload = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setWatermarkFile(file);
  }, [setWatermarkFile]);

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="text-center space-y-2 md:space-y-3 px-3 md:px-0">
        <h1 className="text-xl md:text-3xl font-semibold text-foreground tracking-tight">
          Zusätzliche Services
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-tight md:leading-relaxed">
          Erweitern Sie Ihre Bestellung mit unseren professionellen Zusatzservices.
        </p>
      </div>

      <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto px-3 md:px-0">
        <div className="grid gap-3 md:gap-4">
          {extrasConfig.map(extra => (
            <Card 
              key={extra.id} 
              className={`cursor-pointer transition-all duration-200 rounded-2xl md:rounded-lg ${
                extra.enabled 
                  ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)]' 
                  : 'border-border shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]'
              } md:hover:shadow-md`}
              onClick={() => handleExtraToggle(extra.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-lg bg-muted/50 flex items-center justify-center">
                      <extra.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground stroke-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm md:text-base font-semibold text-foreground">{extra.title}</h3>
                        <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5">
                          {extra.price}/pro Bild
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground leading-tight">{extra.description}</p>
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

        {extras.watermark && (
          <Card className="border-primary/20 bg-primary/5 rounded-2xl md:rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.05)]">
            <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
              <CardTitle className="text-base md:text-lg">Wasserzeichen-Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 px-4 md:px-6 pb-4 md:pb-6">
              <p className="text-xs md:text-sm text-muted-foreground">
                Laden Sie Ihr Logo oder Wasserzeichen hoch (PNG, JPG, max. 5MB)
              </p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWatermarkUpload}
                  className="block w-full text-xs md:text-sm text-muted-foreground file:mr-3 md:file:mr-4 file:py-2 file:px-3 md:file:px-4 file:rounded-xl md:file:rounded-lg file:border-0 file:text-xs md:file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {watermarkFile && (
                  <p className="text-xs md:text-sm text-success">
                    Datei ausgewählt: {watermarkFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center text-xs md:text-sm text-muted-foreground px-3 md:px-0">
        Alle Preise sind zzgl. 19% MwSt.
      </div>

      {/* Desktop Actions - hidden on mobile */}
      <div className="hidden md:flex justify-between max-w-2xl mx-auto">
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
