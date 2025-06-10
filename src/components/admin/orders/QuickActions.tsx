
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
  isUpdating: boolean;
}

const QuickActions = ({ order, selectedStatus, setSelectedStatus, onStatusUpdate, isUpdating }: QuickActionsProps) => {
  const getQuickActions = () => {
    const currentStatus = order?.status || 'pending';
    
    switch (currentStatus) {
      case 'pending':
        return [
          { status: 'processing', label: 'Bearbeitung starten', icon: Clock, variant: 'default' },
          { status: 'cancelled', label: 'Stornieren', icon: X, variant: 'destructive' }
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
          { status: 'delivered', label: 'Als bezahlt markieren', icon: Euro, variant: 'default' }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  const handleQuickAction = (status: string) => {
    setSelectedStatus(status);
    // Kleine Verzögerung um sicherzustellen, dass der Status gesetzt wurde
    setTimeout(() => {
      onStatusUpdate();
    }, 100);
  };

  if (quickActions.length === 0) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-3">
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
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-3">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm text-gray-700">Schnellaktionen</h3>
            <p className="text-xs text-gray-600">Häufig verwendete Aktionen</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.status}
                  size="sm"
                  variant={action.variant as any}
                  onClick={() => handleQuickAction(action.status)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 h-12 text-xs font-medium justify-start p-2"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-md">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-left leading-tight">{action.label}</span>
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
