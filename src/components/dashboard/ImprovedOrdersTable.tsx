
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ImprovedOrdersTable = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['recent-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          packages (
            name
          )
        `)
        .eq('user_id', user.id)
        .neq('payment_flow_status', 'draft')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Warteschlange', variant: 'secondary' as const },
      processing: { label: 'In Bearbeitung', variant: 'default' as const },
      quality_check: { label: 'Qualitätsprüfung', variant: 'default' as const },
      completed: { label: 'Abgeschlossen', variant: 'secondary' as const },
      delivered: { label: 'Geliefert', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, variant: 'secondary' as const };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatOrderId = (id: string) => {
    return `#${id.slice(0, 8).toUpperCase()}`;
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders?order=${orderId}`);
  };

  const handleDownload = (orderId: string) => {
    // TODO: Implement download functionality
    console.log('Download order:', orderId);
  };

  const handleViewAllOrders = () => {
    navigate('/orders');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Letzte Bestellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Letzte Bestellungen</CardTitle>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Bestellnummer</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Datum</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Bilderanzahl</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono text-sm">
                        {formatOrderId(order.id)}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('de-DE')}
                      </td>
                      <td className="py-3 px-2 text-sm">
                        {order.image_count}
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(order.status || 'pending')}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            👁️ Ansehen
                          </Button>
                          {order.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(order.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              ⬇️ Download
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-center mt-6">
              <Button variant="outline" onClick={handleViewAllOrders}>
                Alle Bestellungen ansehen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Noch keine Bestellungen vorhanden</p>
            <Button onClick={() => navigate('/order-flow')}>
              Erste Bestellung erstellen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedOrdersTable;
