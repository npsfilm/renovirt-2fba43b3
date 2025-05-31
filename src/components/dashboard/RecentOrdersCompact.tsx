
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, Download, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const RecentOrdersCompact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, image_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_pending':
        return 'bg-orange-100 text-orange-800';
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
      case 'pending':
        return 'Ausstehend';
      case 'payment_pending':
        return 'Zahlung ausstehend';
      default:
        return status;
    }
  };

  const formatOrderId = (id: string) => {
    return `ORD-${id.slice(0, 6).toUpperCase()}`;
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders?selected=${orderId}`);
  };

  if (!recentOrders?.length) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg">Letzte Bestellungen</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Noch keine Bestellungen</p>
            <Button variant="link" size="sm" className="mt-2" onClick={() => navigate('/order-flow')}>
              Erste Bestellung erstellen →
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">Letzte Bestellungen</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <button 
                  onClick={() => handleOrderClick(order.id)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {formatOrderId(order.id)}
                </button>
                <p className="text-xs text-gray-500">
                  {order.image_count} Bilder • {new Date(order.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getStatusColor(order.status || 'pending')}`}>
                {getStatusLabel(order.status || 'pending')}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleOrderClick(order.id)}
                title="Bestellung anzeigen"
              >
                <Eye className="w-3 h-3" />
              </Button>
              {order.status === 'completed' && (
                <Button variant="ghost" size="sm">
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersCompact;
