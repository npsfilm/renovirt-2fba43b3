
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CreditCard, 
  Download, 
  FileText, 
  Calendar,
  Euro,
  Receipt
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const BillingOverview = () => {
  const { user } = useAuth();

  const { data: billingData } = useQuery({
    queryKey: ['user-billing', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, total_price, created_at, status, image_count, package_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalSpent = orders?.reduce((sum, order) => 
        sum + (parseFloat(order.total_price?.toString() || '0')), 0) || 0;

      const completedOrders = orders?.filter(order => order.status === 'completed') || [];
      const pendingPayments = orders?.filter(order => order.status === 'payment_pending') || [];

      return {
        orders: orders || [],
        totalSpent,
        completedOrders: completedOrders.length,
        pendingPayments,
        totalPending: pendingPayments.reduce((sum, order) => 
          sum + (parseFloat(order.total_price?.toString() || '0')), 0)
      };
    },
    enabled: !!user?.id,
  });

  const formatOrderId = (id: string) => {
    return `RE-${id.slice(0, 8).toUpperCase()}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Bezahlt</Badge>;
      case 'payment_pending':
        return <Badge className="bg-orange-100 text-orange-800">Ausstehend</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Euro className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  €{billingData?.totalSpent.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-600">Gesamt ausgegeben</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {billingData?.completedOrders || 0}
                </p>
                <p className="text-xs text-gray-600">Bezahlte Rechnungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  €{billingData?.totalPending.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-600">Offene Rechnungen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Zahlungsmethode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Kreditkarte ****1234</p>
                  <p className="text-sm text-gray-500">Läuft ab 12/26</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
            </div>
            <Button variant="outline" size="sm">
              Zahlungsmethode ändern
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Rechnungshistorie
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Alle exportieren
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {billingData?.orders.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rechnungs-Nr.</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {formatOrderId(order.id)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(order.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">Bildbearbeitung</p>
                        <p className="text-sm text-gray-500">{order.image_count} Bilder</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status || 'pending')}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      €{parseFloat(order.total_price?.toString() || '0').toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {order.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        {order.status === 'payment_pending' && (
                          <Button size="sm">
                            Bezahlen
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Noch keine Rechnungen vorhanden</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingOverview;
