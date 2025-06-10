
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Package } from 'lucide-react';
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

  const handleQuickAction = (status: string) => {
    setSelectedStatus(status);
    // Trigger update after setting status
    setTimeout(() => {
      onStatusUpdate();
    }, 100);
  };

  if (quickActions.length === 0) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Bestellung abgeschlossen
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Schnellaktionen</h3>
            <p className="text-xs text-gray-600">Häufig verwendete Statusänderungen</p>
          </div>
          <div className="flex gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.status}
                  size="sm"
                  variant={action.variant as any}
                  onClick={() => handleQuickAction(action.status)}
                  disabled={isUpdating}
                  className="flex items-center gap-1 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
