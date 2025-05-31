
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, FileText, RotateCcw, Plus, MessageSquare, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface OrdersOverviewProps {
  onOrderSelect?: (orderId: string) => void;
}

const OrdersOverview = ({ onOrderSelect }: OrdersOverviewProps) => {
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: orders } = useQuery({
    queryKey: ['user-orders', user?.id, filter],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          image_count,
          total_price,
          packages(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        if (filter === 'pending') {
          query = query.in('status', ['pending', 'payment_pending']);
        } else {
          query = query.eq('status', filter);
        }
      }

      const { data, error } = await query;
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
        return 'Abgeschlossen';
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

  const formatOrderId = (id: string) => {
    return `ORD-${id.slice(0, 6).toUpperCase()}`;
  };

  const handleOrderClick = (orderId: string) => {
    if (onOrderSelect) {
      onOrderSelect(orderId);
    }
  };

  if (!orders?.length) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Ihre Bestellungen
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Noch keine Bestellungen</p>
            <p className="text-sm mb-4">Erstellen Sie Ihre erste Bestellung, um loszulegen.</p>
            <Button onClick={() => navigate('/order-flow')}>
              <Plus className="w-4 h-4 mr-2" />
              Neue Bestellung erstellen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Ihre Bestellungen
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Datum
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'completed', label: 'Abgeschlossen' },
            { key: 'processing', label: 'In Bearbeitung' },
            { key: 'pending', label: 'Ausstehend' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleOrderClick(order.id)}
                      className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {formatOrderId(order.id)}
                    </button>
                    <Badge className={getStatusColor(order.status || 'pending')}>
                      {getStatusLabel(order.status || 'pending')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {(order.packages as any)?.name || 'Standard Paket'} • {order.image_count} Bilder • {new Date(order.created_at).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-900">€{parseFloat(order.total_price?.toString() || '0').toFixed(2)}</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOrderClick(order.id)}
                    title="Bestellung anzeigen"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => navigate('/order-flow')}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Erneut bestellen
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/order-flow')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Nachbestellen
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Kommentieren
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersOverview;
