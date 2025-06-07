
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileImage, User, Building2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import type { OrderData } from '@/utils/orderValidation';

interface OrderSummaryDetailsProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
}

const OrderSummaryDetails = ({ orderData, onUpdateData }: OrderSummaryDetailsProps) => {
  const [isUploadingWatermark, setIsUploadingWatermark] = useState(false);
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

  const handleWatermarkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setIsUploadingWatermark(true);

    try {
      onUpdateData({ watermarkFile: file });
    } catch (error) {
      console.error('Watermark upload error:', error);
    } finally {
      setIsUploadingWatermark(false);
    }
  };

  const getPhotoTypeLabel = (type?: string) => {
    switch (type) {
      case 'handy': return 'Smartphone';
      case 'kamera': return 'Kamera';
      case 'bracketing-3': return 'Bracketing (3 Bilder)';
      case 'bracketing-5': return 'Bracketing (5 Bilder)';
      default: return 'Nicht ausgewählt';
    }
  };

  const getPackageLabel = (pkg?: string) => {
    switch (pkg) {
      case 'basic': return 'Basic';
      case 'premium': return 'Premium';
      default: return 'Nicht ausgewählt';
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Kontaktdaten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-Mail-Adresse *
              </Label>
              <Input
                id="email"
                type="email"
                value={orderData.email || ''}
                onChange={(e) => onUpdateData({ email: e.target.value })}
                placeholder="ihre@email.de"
                required
              />
            </div>
            <div>
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Unternehmen
              </Label>
              <Input
                id="company"
                value={orderData.company || profile?.company || ''}
                onChange={(e) => onUpdateData({ company: e.target.value })}
                placeholder="Mustermann GmbH"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Bestelldetails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Foto-Typ</Label>
              <div className="mt-1">
                <Badge variant="secondary">{getPhotoTypeLabel(orderData.photoType)}</Badge>
              </div>
            </div>
            <div>
              <Label>Paket</Label>
              <div className="mt-1">
                <Badge variant="secondary">{getPackageLabel(orderData.package)}</Badge>
              </div>
            </div>
            <div>
              <Label>Anzahl Bilder</Label>
              <div className="mt-1">
                <Badge variant="secondary">{orderData.files.length} Bilder</Badge>
              </div>
            </div>
          </div>

          {/* Object Reference */}
          <div>
            <Label htmlFor="objectReference">Objektreferenz</Label>
            <Input
              id="objectReference"
              value={orderData.objectReference || ''}
              onChange={(e) => onUpdateData({ objectReference: e.target.value })}
              placeholder="z.B. Musterstraße 123, 12345 Musterstadt"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Referenz für das fotografierte Objekt (Adresse, Projektnummer, etc.)
            </p>
          </div>

          {/* Extras */}
          {(orderData.extras.express || orderData.extras.upscale || orderData.extras.watermark) && (
            <div>
              <Label>Gewählte Extras</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {orderData.extras.express && <Badge variant="outline">Express-Bearbeitung (+50%)</Badge>}
                {orderData.extras.upscale && <Badge variant="outline">Upscaling auf 4K (+2€/Bild)</Badge>}
                {orderData.extras.watermark && <Badge variant="outline">Wasserzeichen entfernen (+1€/Bild)</Badge>}
              </div>
            </div>
          )}

          {/* Watermark Upload */}
          {orderData.extras.watermark && (
            <div>
              <Label htmlFor="watermark-upload">
                Wasserzeichen-Datei hochladen (optional)
              </Label>
              <div className="mt-2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('watermark-upload')?.click()}
                    disabled={isUploadingWatermark}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingWatermark ? 'Wird hochgeladen...' : 'Datei wählen'}
                  </Button>
                  {orderData.watermarkFile && (
                    <span className="text-sm text-muted-foreground">
                      {orderData.watermarkFile.name}
                    </span>
                  )}
                </div>
                <input
                  id="watermark-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleWatermarkUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG oder GIF. Max. 5MB. Hilft bei der präzisen Entfernung.
                </p>
              </div>
            </div>
          )}

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">Besondere Wünsche (optional)</Label>
            <Textarea
              id="specialRequests"
              value={orderData.specialRequests || ''}
              onChange={(e) => onUpdateData({ specialRequests: e.target.value })}
              placeholder="Beschreiben Sie hier spezielle Anforderungen für die Bildbearbeitung..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummaryDetails;
