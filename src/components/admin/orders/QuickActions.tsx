
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Euro, X } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface QuickActionsProps {
  order: ExtendedOrder | undefined;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onStatusUpdate: () => void;
  onPaymentUpdate: () => void;
  isUpdating: boolean;
}

const QuickActions = ({
  order,
  selectedStatus,
  setSelectedStatus,
  onStatusUpdate,
  onPaymentUpdate,
  isUpdating
}: QuickActionsProps) => {
  const getQuickActions = () => {
    const currentStatus = order?.status || 'pending';
    switch (currentStatus) {
      case 'pending':
        return [{
          status: 'processing',
          label: 'Bearbeitung starten',
          icon: Clock,
          variant: 'default'
        }, {
          status: 'cancelled',
          label: 'Stornieren',
          icon: X,
          variant: 'destructive'
        }];
      case 'processing':
        return [{
          status: 'quality_check',
          label: 'Zur Prüfung',
          icon: CheckCircle,
          variant: 'default'
        }, {
          status: 'revision',
          label: 'Revision nötig',
          icon: AlertCircle,
          variant: 'secondary'
        }];
      case 'quality_check':
        return [{
          status: 'completed',
          label: 'Abschließen',
          icon: CheckCircle,
          variant: 'default'
        }, {
          status: 'revision',
          label: 'Zurück zur Revision',
          icon: AlertCircle,
          variant: 'secondary'
        }];
      case 'completed':
        return []; // Keine Status-Schnellaktionen für abgeschlossene Bestellungen
      default:
        return [];
    }
  };

  const getPaymentActions = () => {
    const paymentStatus = order?.payment_status || 'pending';
    const orderStatus = order?.status || 'pending';
    
    // Zeige Bezahlt-Button nur wenn Bestellung noch nicht als bezahlt markiert ist
    if (paymentStatus !== 'paid') {
      return [{
        action: 'mark_paid',
        label: 'Als bezahlt markieren',
        icon: Euro,
        variant: 'outline'
      }];
    }
    
    return [];
  };

  const quickActions = getQuickActions();
  const paymentActions = getPaymentActions();

  const handleQuickAction = (status: string) => {
    setSelectedStatus(status);
    // Kleine Verzögerung um sicherzustellen, dass der Status gesetzt wurde
    setTimeout(() => {
      onStatusUpdate();
    }, 100);
  };

  const handlePaymentAction = () => {
    onPaymentUpdate();
  };

  // Zeige spezielle Karte wenn Bestellung abgeschlossen ist
  if (order?.status === 'completed' && order?.payment_status === 'paid') {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-3">
          <div className="text-center">
            <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
              Bestellung abgeschlossen & bezahlt
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Zeige Aktionen wenn vorhanden
  if (quickActions.length === 0 && paymentActions.length === 0) {
    return (
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-3">
          <div className="text-center">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
              {order?.status === 'completed' ? 'Bestellung abgeschlossen' : 'Keine Aktionen verfügbar'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm mb-3">Schnellaktionen</h3>
        <div className="space-y-2">
          {/* Status Aktionen */}
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.status}
                onClick={() => handleQuickAction(action.status)}
                disabled={isUpdating}
                variant={action.variant as any}
                size="sm"
                className="w-full justify-start text-xs"
              >
                <IconComponent className="w-3 h-3 mr-2" />
                {action.label}
              </Button>
            );
          })}
          
          {/* Payment Aktionen */}
          {paymentActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.action}
                onClick={handlePaymentAction}
                disabled={isUpdating}
                variant={action.variant as any}
                size="sm"
                className="w-full justify-start text-xs"
              >
                <IconComponent className="w-3 h-3 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
