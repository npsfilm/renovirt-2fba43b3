
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Edit, MessageSquare } from 'lucide-react';
import StatusUpdateModal from './StatusUpdateModal';

interface OrderProgressCardProps {
  order: {
    id: string;
    status: string;
    estimated_completion?: string;
    created_at: string;
    admin_notes?: string;
  };
}

const OrderProgressCard = ({ order }: OrderProgressCardProps) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending':
        return 10;
      case 'processing':
        return 40;
      case 'quality_check':
        return 80;
      case 'completed':
        return 100;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'quality_check':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend';
      case 'processing':
        return 'In Bearbeitung';
      case 'quality_check':
        return 'Qualitätsprüfung';
      case 'completed':
        return 'Abgeschlossen';
      case 'delivered':
        return 'Ausgeliefert';
      default:
        return status;
    }
  };

  const progress = getStatusProgress(order.status);
  const isCompleted = order.status === 'completed' || order.status === 'delivered';

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Bestellfortschritt</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatusModalOpen(true)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Status ändern
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                Erstellt: {new Date(order.created_at).toLocaleDateString('de-DE')}
              </span>
            </div>
            
            {order.estimated_completion && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Geschätzte Fertigstellung: {new Date(order.estimated_completion).toLocaleDateString('de-DE')}
                </span>
              </div>
            )}
          </div>

          {order.admin_notes && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Admin-Notizen</span>
              </div>
              <p className="text-sm text-gray-600">{order.admin_notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">{progress}%</div>
              <div className="text-xs text-gray-500">Fortschritt</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-semibold text-gray-900">
                {isCompleted ? '✓' : '⏳'}
              </div>
              <div className="text-xs text-gray-500">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatusUpdateModal
        orderId={order.id}
        currentStatus={order.status || 'pending'}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </>
  );
};

export default OrderProgressCard;
