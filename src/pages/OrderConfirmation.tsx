import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, Calendar, Clock, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import { useAuth } from '@/hooks/useAuth';
import MobileLayout from '@/components/layout/MobileLayout';


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
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Bestelldetails werden geladen...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Bestellung nicht gefunden
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
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

  // ETA-Berechnung nach bereits verwendeten Regeln (Werktage 10–18 Uhr, Express 24h / Standard 48h)
  const BUS_START_HOUR = 10;
  const BUS_END_HOUR = 18;
  const EXPRESS_HOURS = 24;
  const STANDARD_HOURS = 48;

  const nextBusinessDay = (dt: Date): Date => {
    const d = new Date(dt);
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
    d.setHours(BUS_START_HOUR, 0, 0, 0);
    return d;
  };

  const processingStart = (orderDt: Date): Date => {
    const orderHour = orderDt.getHours();
    if (orderDt.getDay() === 0 || orderDt.getDay() === 6) return nextBusinessDay(orderDt);
    if (orderHour < BUS_START_HOUR) {
      const result = new Date(orderDt);
      result.setHours(BUS_START_HOUR, 0, 0, 0);
      return result;
    }
    if (orderHour >= BUS_END_HOUR) {
      return nextBusinessDay(orderDt);
    }
    return orderDt;
  };

  const intoDeliveryWindow = (dt: Date): Date => {
    let result = new Date(dt);
    if (result.getDay() === 0 || result.getDay() === 6) {
      result = nextBusinessDay(result);
    }
    const hour = result.getHours();
    if (hour < BUS_START_HOUR) {
      result.setHours(BUS_START_HOUR, 0, 0, 0);
    } else if (hour >= BUS_END_HOUR) {
      result = nextBusinessDay(result);
    }
    return result;
  };

  const calculateETA = (orderDt: Date, express: boolean): Date => {
    const start = processingStart(orderDt);
    const hours = express ? EXPRESS_HOURS : STANDARD_HOURS;
    const target = new Date(start);
    target.setTime(target.getTime() + hours * 60 * 60 * 1000);
    return intoDeliveryWindow(target);
  };

  const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin',
    }).format(date);

  const orderCreatedAt = new Date(order.created_at);
  const deliveryDate = calculateETA(orderCreatedAt, !!order.extras?.express);
  const slaHours = order.extras?.express ? 24 : 48;

  const extras = formatExtras(order.extras);

  return (
    <MobileLayout>
      <div className="min-h-screen bg-muted py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Bestellung erfolgreich aufgegeben!
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Vielen Dank für Ihre Bestellung. Wir haben alle Details erhalten und werden mit der Bearbeitung beginnen.
              </p>
            </CardHeader>
            <CardFooter className="justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-subtle">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-sm">SSL-gesicherte Übertragung</span>
              </div>
              <div className="flex items-center gap-2 text-subtle">
                <Lock className="w-4 h-4 text-success" />
                <span className="text-sm">Datenschutz (DSGVO)</span>
              </div>
              <div className="flex items-center gap-2 text-subtle">
                <CreditCard className="w-4 h-4 text-success" />
                <span className="text-sm">Sichere Zahlung</span>
              </div>
            </CardFooter>
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
                  <span className="text-muted-foreground">Bestellnummer:</span>
                  <span className="font-semibold">{order.order_number}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Bestelldatum:</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">E-Mail:</span>
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
                  <span className="text-muted-foreground">Paket:</span>
                  <span className="font-semibold">{order.package.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Foto-Typ:</span>
                  <span>{formatPhotoType(order.photo_type)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Anzahl Bilder:</span>
                  <span>{order.image_count}</span>
                </div>
                
                {extras.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-2">Extras:</span>
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

          {/* Lieferzeit & Zeitplan */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Lieferzeit & Zeitplan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Voraussichtliche Fertigstellung</p>
                  <p className="font-semibold">{formatDateTime(deliveryDate)}</p>
                  <p className="text-xs text-subtle mt-1">Bearbeitungszeit: {slaHours} Std. innerhalb der Geschäftszeiten (Mo.–Fr., 10–18 Uhr)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preisübersicht */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Preisübersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Gesamtpreis:</span>
                <span>{order.total_price.toFixed(2)} €</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
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
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">1</span>
                </div>
                <p className="text-foreground">Sie erhalten eine Bestätigungs-E-Mail mit allen Details.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">2</span>
                </div>
                <p className="text-foreground">Wir beginnen mit der professionellen Bearbeitung Ihrer Bilder.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">3</span>
                </div>
                <p className="text-foreground">Sie erhalten eine Benachrichtigung, sobald Ihre Bilder fertig sind.</p>
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
    </MobileLayout>
  );
};

export default OrderConfirmation;