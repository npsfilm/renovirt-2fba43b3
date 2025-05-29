
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, MessageSquare, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const RecentActivity = () => {
  const { user } = useAuth();

  const { data: recentOrders } = useQuery({
    queryKey: ['user-recent-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, image_count, total_price, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Fertig';
      case 'processing':
        return 'In Bearbeitung';
      case 'payment_pending':
        return 'Zahlung ausstehend';
      case 'pending':
        return 'Ausstehend';
      default:
        return status;
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'processing':
        return 65;
      case 'payment_pending':
        return 100;
      case 'pending':
        return 10;
      default:
        return 0;
    }
  };

  const formatOrderId = (id: string) => {
    return id.slice(0, 8).toUpperCase();
  };

  if (!recentOrders?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="w-5 h-5 mr-2 text-blue-600" />
            Letzte Aktivitäten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Image className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Noch keine Aktivitäten</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                    Bestellung #{formatOrderId(order.id)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.image_count} Bilder
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(order.status || 'pending')}>
                {getStatusLabel(order.status || 'pending')}
              </Badge>
            </div>

            {order.status === 'processing' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fortschritt</span>
                  <span className="text-gray-900">{getProgress(order.status)}%</span>
                </div>
                <Progress value={getProgress(order.status)} className="h-2" />
                <p className="text-xs text-gray-500">
                  Wird bearbeitet...
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
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Rechnung
                  </Button>
                </>
              )}
              
              {order.status === 'payment_pending' && (
                <Button size="sm">
                  Jetzt bezahlen (€{parseFloat(order.total_price?.toString() || '0').toFixed(2)})
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
