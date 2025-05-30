
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, Package, Truck } from 'lucide-react';

interface StatusHistoryItem {
  id: string;
  status: string;
  message?: string;
  created_at: string;
  estimated_completion?: string;
}

interface OrderStatusTimelineProps {
  statusHistory: StatusHistoryItem[];
  currentStatus: string;
  estimatedCompletion?: string;
}

const OrderStatusTimeline = ({ statusHistory, currentStatus, estimatedCompletion }: OrderStatusTimelineProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'quality_check':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'delivered':
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Status-Verlauf
          <Badge className={getStatusColor(currentStatus)}>
            {getStatusLabel(currentStatus)}
          </Badge>
        </CardTitle>
        {estimatedCompletion && (
          <p className="text-sm text-gray-600">
            Voraussichtliche Fertigstellung: {new Date(estimatedCompletion).toLocaleString('de-DE')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusHistory.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">
                    {getStatusLabel(item.status)}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleString('de-DE')}
                  </span>
                </div>
                {item.message && (
                  <p className="text-sm text-gray-600">{item.message}</p>
                )}
                {item.estimated_completion && (
                  <p className="text-xs text-gray-500 mt-1">
                    Geschätzte Fertigstellung: {new Date(item.estimated_completion).toLocaleString('de-DE')}
                  </p>
                )}
              </div>
              {index < statusHistory.length - 1 && (
                <div className="absolute left-6 mt-10 w-0.5 h-8 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusTimeline;
