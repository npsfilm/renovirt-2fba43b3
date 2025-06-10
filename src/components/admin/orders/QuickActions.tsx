
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Package, Euro } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface QuickActionsProps {
  order: ExtendedOrder | undefined;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onStatusUpdate: () => void;
  isUpdating: boolean;
}

const QuickActions = ({ order, selectedStatus, setSelectedStatus, onStatusUpdate, isUpdating }: QuickActionsProps) => {
  const getQuickActions = () => {
    const currentStatus = order?.status || 'pending';
    
    switch (currentStatus) {
      case 'pending':
        return [
          { status: 'processing', label: 'Bearbeitung starten', icon: Clock, variant: 'default' },
          { status: 'cancelled', label: 'Stornieren', icon: AlertCircle, variant: 'destructive' }
        ];
      case 'processing':
        return [
          { status: 'quality_check', label: 'Zur Prüfung', icon: CheckCircle, variant: 'default' },
          { status: 'revision', label: 'Revision nötig', icon: AlertCircle, variant: 'secondary' }
        ];
      case 'quality_check':
        return [
          { status: 'completed', label: 'Abschließen', icon: CheckCircle, variant: 'default' },
          { status: 'revision', label: 'Zurück zur Revision', icon: AlertCircle, variant: 'secondary' }
        ];
      case 'completed':
        return [
          { status: 'delivered', label: 'Als bezahlt markieren', icon: Package, variant: 'default' }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();
  const showPaymentButton = order?.status === 'completed' && order?.payment_status !== 'paid';

  const handleQuickAction = (status: string) => {
    setSelectedStatus(status);
    onStatusUpdate();
  };

  const handleMarkAsPaid = () => {
    setSelectedStatus('delivered');
    onStatusUpdate();
  };

  if (quickActions.length === 0 && !showPaymentButton) {
    return (
      <Card className="border-2 border-green-200 bg-green-50 max-w-xs">
        <CardContent className="p-2">
          <div className="text-center">
            <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
              Bestellung abgeschlossen
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50 max-w-xs">
      <CardContent className="p-2">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-sm text-gray-700">Schnellaktionen</h3>
            <p className="text-xs text-gray-600">Häufig verwendete Aktionen</p>
          </div>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.status}
                  size="sm"
                  variant={action.variant as any}
                  onClick={() => handleQuickAction(action.status)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 text-xs h-7 w-full justify-start"
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate text-left">{action.label}</span>
                </Button>
              );
            })}
            
            {showPaymentButton && (
              <Button
                size="sm"
                variant="default"
                onClick={handleMarkAsPaid}
                disabled={isUpdating}
                className="flex items-center gap-2 text-xs h-7 w-full justify-start bg-green-600 hover:bg-green-700"
              >
                <Euro className="w-3 h-3 flex-shrink-0" />
                <span className="truncate text-left">Als bezahlt markieren</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
