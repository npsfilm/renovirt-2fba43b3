
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, MessageSquare, Image } from 'lucide-react';

const RecentActivity = () => {
  // Mock data - in real app this would come from API
  const recentOrders = [
    {
      id: '1',
      status: 'completed',
      statusLabel: 'Fertig',
      progress: 100,
      imageCount: 12,
      previewImage: '/placeholder.svg',
      completedAt: '2024-01-28',
      hasInvoice: true,
      hasFeedback: false
    },
    {
      id: '2',
      status: 'processing',
      statusLabel: 'In Bearbeitung',
      progress: 65,
      imageCount: 8,
      previewImage: '/placeholder.svg',
      estimatedCompletion: '2024-01-30'
    },
    {
      id: '3',
      status: 'payment_pending',
      statusLabel: 'Zahlung ausstehend',
      progress: 100,
      imageCount: 5,
      previewImage: '/placeholder.svg',
      amount: '€89.90'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="w-5 h-5 mr-2 text-blue-600" />
          Letzte Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Bestellung #{order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.imageCount} Bilder
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.statusLabel}
              </Badge>
            </div>

            {order.status === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fortschritt</span>
                  <span className="text-gray-900">{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2" />
                <p className="text-xs text-gray-500">
                  Voraussichtlich fertig: {order.estimatedCompletion}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {order.status === 'completed' && (
                <>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Feedback
                  </Button>
                  {order.hasInvoice && (
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      Rechnung
                    </Button>
                  )}
                </>
              )}
              
              {order.status === 'payment_pending' && (
                <Button size="sm">
                  Jetzt bezahlen ({order.amount})
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
