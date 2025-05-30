
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tag, Zap, Scale, Droplets, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderData {
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  couponCode?: string;
  watermarkFile?: File;
}

interface OrderSummaryDetailsProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
}

const OrderSummaryDetails = ({ orderData, onUpdateData }: OrderSummaryDetailsProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const packagePrices = {
    basic: 9.00,
    premium: 13.00,
  };

  const extras = [
    {
      key: 'express' as const,
      icon: Zap,
      title: 'Express-Bearbeitung (+2.00 € pro Bild)',
      description: 'Lieferung in 24h statt 48h. Macht Bilder klickstärker – ideal für hochwertige Listings!',
      price: 2.00,
    },
    {
      key: 'upscale' as const,
      icon: Scale,
      title: 'Weichzeichnen (optional)',
      description: 'Kostenfrei – Sie erhalten beide Versionen (Originalschärfe & Weichgezeichnet). Ideal für einen sanfteren Look.',
      price: 0,
    },
    {
      key: 'watermark' as const,
      icon: Droplets,
      title: 'Eigenes Wasserzeichen verwenden (+1.00 € pro Bild)',
      description: 'Branden Sie Ihre Bilder mit Ihrem eigenen Logo.',
      price: 1.00,
    },
  ];

  const handleExtraChange = (extraKey: keyof typeof orderData.extras, checked: boolean) => {
    onUpdateData({
      extras: {
        ...orderData.extras,
        [extraKey]: checked,
      },
    });
  };

  const handleWatermarkUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/postscript'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.ai'];
    
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast({
        title: "Ungültiges Dateiformat",
        description: "Bitte laden Sie nur JPG, PNG oder AI Dateien hoch.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Datei zu groß",
        description: "Die Datei darf maximal 10 MB groß sein.",
        variant: "destructive",
      });
      return;
    }

    onUpdateData({ watermarkFile: file });
    toast({
      title: "Wasserzeichen hochgeladen",
      description: "Ihre Wasserzeichen-Datei wurde erfolgreich hochgeladen.",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleWatermarkUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const createImagePreview = (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const [imagePreviews, setImagePreviews] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    const loadPreviews = async () => {
      const previews: { [key: string]: string } = {};
      for (let i = 0; i < Math.min(orderData.files.length, 4); i++) {
        const file = orderData.files[i];
        if (file.type.startsWith('image/')) {
          try {
            previews[file.name] = await createImagePreview(file);
          } catch (error) {
            console.error('Error creating preview:', error);
          }
        }
      }
      setImagePreviews(previews);
    };

    if (orderData.files.length > 0) {
      loadPreviews();
    }
  }, [orderData.files]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bestellübersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>E-Mail Adresse (für Auftragsbestätigung & Lieferung):</span>
        </div>
        <Input
          type="email"
          placeholder="kunde@example.com"
          value={orderData.email || ''}
          onChange={(e) => onUpdateData({ email: e.target.value })}
        />

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Gewähltes Paket:</h4>
          <p className="text-gray-600">
            {orderData.package === 'basic' ? 'Basic HDR' : 'Premium HDR & Retusche'} - €{packagePrices[orderData.package!].toFixed(2)} pro Bild
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Optionen:</h4>
          <div className="space-y-3">
            {extras.map((extra) => (
              <div key={extra.key} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={orderData.extras[extra.key]}
                    onCheckedChange={(checked) => handleExtraChange(extra.key, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <extra.icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">{extra.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{extra.description}</p>
                    
                    {extra.key === 'watermark' && orderData.extras.watermark && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="mb-3">
                          <p className="text-sm text-blue-800 font-medium mb-2">
                            Wasserzeichen-Datei hochladen
                          </p>
                          <p className="text-xs text-blue-600 mb-3">
                            Hinweis: Bitte achten Sie auf einen transparenten Hintergrund. 
                            Unterstützte Formate: JPG, PNG, AI (max. 10 MB)
                          </p>
                        </div>
                        
                        {!orderData.watermarkFile ? (
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                              dragActive ? 'border-blue-500 bg-blue-100' : 'border-blue-300 hover:border-blue-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('watermark-upload')?.click()}
                          >
                            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-sm text-blue-600 mb-2">
                              Wasserzeichen hier ablegen oder klicken
                            </p>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.ai"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleWatermarkUpload(file);
                              }}
                              className="hidden"
                              id="watermark-upload"
                            />
                            <Button variant="outline" size="sm" type="button">
                              Datei auswählen
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center space-x-2">
                              <Upload className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-700">{orderData.watermarkFile.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateData({ watermarkFile: undefined })}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Bilder ({orderData.files.length}):</h4>
          <div className="grid grid-cols-4 gap-2">
            {orderData.files.slice(0, 4).map((file, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded border overflow-hidden">
                {imagePreviews[file.name] ? (
                  <img 
                    src={imagePreviews[file.name]} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-500">{file.name.substring(0, 8)}...</span>
                  </div>
                )}
              </div>
            ))}
            {orderData.files.length > 4 && (
              <div className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                <span className="text-xs text-gray-500">+{orderData.files.length - 4} mehr</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <Label>Haben Sie einen Gutschein?</Label>
          </div>
          <Input
            placeholder="Gutscheincode eingeben"
            value={orderData.couponCode || ''}
            onChange={(e) => onUpdateData({ couponCode: e.target.value })}
            className="mt-2"
          />
          {orderData.couponCode === 'WELCOME10' && (
            <p className="text-green-600 text-sm mt-1">10% Rabatt angewendet!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryDetails;
