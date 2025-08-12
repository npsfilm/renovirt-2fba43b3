import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface OrderDetails {
  id: string;
  order_number: string;
  total_price: number;
  image_count: number;
  photo_type: string;
  status: string;
  customer_email: string;
  extras: any;
  created_at: string;
  package: {
    name: string;
    description: string;
  };
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Bestellung nicht angegeben');
        setLoading(false);
        return;
      }

      if (!user) {
        // Warten bis der Benutzer über ProtectedRoute verfügbar ist
        return;
      }

      try {
        console.log('Fetching order with ID:', orderId);
        
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            total_price,
            image_count,
            photo_type,
            status,
            customer_email,
            extras,
            created_at,
            packages!inner (
              name,
              description
            )
          `)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (orderError) {
          console.error('Error fetching order:', orderError);
          setError('Bestellung konnte nicht gefunden werden');
          return;
        }

        if (!orderData) {
          setError('Bestellung nicht gefunden');
          return;
        }

        // Transform the data to match our interface
        const transformedOrder: OrderDetails = {
          ...orderData,
          package: {
            name: orderData.packages.name,
            description: orderData.packages.description
          }
        };

        setOrder(transformedOrder);
        console.log('Order loaded successfully:', transformedOrder);
        
      } catch (err: any) {
        console.error('Error loading order:', err);
        setError('Fehler beim Laden der Bestelldetails');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Bestelldetails werden geladen...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Bestellung nicht gefunden
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">
              {error || 'Die angeforderte Bestellung konnte nicht gefunden werden.'}
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/orders')} className="w-full">
                Meine Bestellungen ansehen
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                Zurück zum Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatExtras = (extras: any) => {
    if (!extras || typeof extras !== 'object') return [];
    
    const extrasList = [];
    if (extras.upscale) extrasList.push('Upscaling');
    if (extras.express) extrasList.push('Express Bearbeitung');
    if (extras.watermark) extrasList.push('Wasserzeichen entfernen');
    
    return extrasList;
  };

  const formatPhotoType = (photoType: string) => {
    const types = {
      'handy': 'Handy-Fotos',
      'kamera': 'Kamera-Fotos',
      'bracketing-3': 'Bracketing (3 Aufnahmen)',
      'bracketing-5': 'Bracketing (5 Aufnahmen)'
    };
    return types[photoType as keyof typeof types] || photoType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extras = formatExtras(order.extras);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Bestellung erfolgreich aufgegeben!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Vielen Dank für Ihre Bestellung. Wir haben alle Details erhalten und werden mit der Bearbeitung beginnen.
            </p>
          </CardHeader>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Bestellübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bestellnummer:</span>
                <span className="font-semibold">{order.order_number}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {order.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bestelldatum:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">E-Mail:</span>
                <span>{order.customer_email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Package & Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Paket & Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paket:</span>
                <span className="font-semibold">{order.package.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Foto-Typ:</span>
                <span>{formatPhotoType(order.photo_type)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Anzahl Bilder:</span>
                <span>{order.image_count}</span>
              </div>
              
              {extras.length > 0 && (
                <div>
                  <span className="text-gray-600 block mb-2">Extras:</span>
                  <div className="flex flex-wrap gap-2">
                    {extras.map((extra, index) => (
                      <Badge key={index} variant="secondary">
                        {extra}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Preisübersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Gesamtpreis:</span>
              <span>{order.total_price.toFixed(2)} €</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Inkl. 19% MwSt. | Sie erhalten eine Rechnung per E-Mail.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Nächste Schritte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <p className="text-gray-700">Sie erhalten eine Bestätigungs-E-Mail mit allen Details.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <p className="text-gray-700">Wir beginnen mit der professionellen Bearbeitung Ihrer Bilder.</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <p className="text-gray-700">Sie erhalten eine Benachrichtigung, sobald Ihre Bilder fertig sind.</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={() => navigate('/orders')} className="w-full">
            Alle meine Bestellungen ansehen
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;