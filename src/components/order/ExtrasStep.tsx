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
  // Separate stable selectors to minimize re-renders
  const extras = useOrderStore((state) => state.extras);
  const watermarkFile = useOrderStore((state) => state.watermarkFile);
  const setExtras = useOrderStore((state) => state.setExtras);
  const setWatermarkFile = useOrderStore((state) => state.setWatermarkFile);
  
  // Memoize extras configuration to prevent unnecessary re-creations
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

  // Memoize handlers to prevent unnecessary re-renders of Switch components
  const handleExtraToggle = React.useCallback((extraId: 'upscale' | 'express' | 'watermark') => {
    const currentValue = extras[extraId];
    if (currentValue !== undefined) {
      setExtras({
        [extraId]: !currentValue
      });
    }
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
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Wählen Sie optionale Zusatzleistungen für eine noch bessere Bildbearbeitung.
        </p>
      </div>

      <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto px-3 md:px-0">
        <div className="grid gap-3 md:gap-4">
          {extrasConfig.map((extra) => (
            <Card 
              key={extra.id} 
              className={`cursor-pointer transition-all duration-200 rounded-2xl md:rounded-lg ${
                extra.enabled 
                  ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)]' 
                  : 'hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:scale-[1.01] border-border bg-card'
              }`}
              onClick={() => handleExtraToggle(extra.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <extra.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3">
                        <h3 className="text-base md:text-lg font-semibold text-foreground">{extra.title}</h3>
                        <Badge variant="outline" className="px-2 py-0.5 text-xs rounded-full">
                          {extra.price}
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

        {/* Watermark Upload Section */}
        {extras.watermark && (
          <div className="mt-6 p-4 md:p-6 bg-muted/30 rounded-2xl md:rounded-lg border">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-3">
              Wasserzeichen hochladen
            </h3>
            <div className="space-y-3">
              <input
                id="watermark-upload"
                type="file"
                accept="image/*,.svg"
                onChange={handleWatermarkUpload}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer transition-colors"
              />
              {watermarkFile && (
                <p className="text-xs md:text-sm text-success">
                  Datei ausgewählt: {watermarkFile.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Unterstützte Formate: PNG, JPG, SVG (transparent empfohlen)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Actions - hidden on mobile */}
      <div className="hidden md:flex justify-between max-w-2xl mx-auto">
        <Button variant="outline" onClick={onPrev} className="shadow-sm">
          ← Zurück zu Paketen
        </Button>
        <Button onClick={onNext} className="min-w-[150px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
          Weiter zur Übersicht →
        </Button>
      </div>
    </div>
  );
};

export default ExtrasStep;