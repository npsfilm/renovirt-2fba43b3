import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Calendar, Euro, Receipt, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';
import { downloadFile } from '@/utils/fileDownloadService';

const BillingOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isAdmin } = useAdminRole();
  const {
    data: billingData
  } = useQuery({
    queryKey: ['user-billing', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data: orders,
        error
      } = await supabase.from('orders').select(`
          id, 
          total_price, 
          created_at, 
          status, 
          image_count, 
          package_id,
          order_number,
          payment_status,
          stripe_session_id,
          order_images (
            id,
            file_name,
            file_size,
            file_type,
            storage_path
          ),
          order_invoices (
            id,
            file_name,
            file_size,
            file_type,
            storage_path,
            uploaded_by_name,
            created_at
          ),
          packages (
            name
          )
        `).eq('user_id', user.id).neq('payment_flow_status', 'draft').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      const totalSpent = orders?.reduce((sum, order) => sum + parseFloat(order.total_price?.toString() || '0'), 0) || 0;
      const completedOrders = orders?.filter(order => order.status === 'completed') || [];
      const pendingPayments = orders?.filter(order => order.payment_status === 'pending') || [];
      return {
        orders: orders || [],
        totalSpent,
        completedOrders: completedOrders.length,
        pendingPayments,
        totalPending: pendingPayments.reduce((sum, order) => sum + parseFloat(order.total_price?.toString() || '0'), 0)
      };
    },
    enabled: !!user?.id
  });
  const formatOrderId = (order: any) => {
    return order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;
  };
  const getStatusBadge = (status: string, paymentStatus?: string) => {
    if (paymentStatus === 'paid' && status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Bezahlt</Badge>;
    }
    if (paymentStatus === 'pending') {
      return <Badge className="bg-orange-100 text-orange-800">Ausstehend</Badge>;
    }
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Abgeschlossen</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };
  const handleDownloadInvoice = async (order: any) => {
    try {
      // Get the first available invoice for this order
      const invoice = order.order_invoices?.[0];
      if (!invoice) {
        toast({
          title: "Fehler",
          description: "Keine Rechnung für diese Bestellung verfügbar.",
          variant: "destructive"
        });
        return;
      }

      await downloadFile('order-invoices', invoice.storage_path, invoice.file_name);
      
      toast({
        title: "Rechnung heruntergeladen",
        description: `Rechnung für Bestellung ${formatOrderId(order)} wurde heruntergeladen.`
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: "Fehler beim Herunterladen",
        description: "Die Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
    }
  };
  const handleExportAll = () => {
    toast({
      title: "Export wird vorbereitet",
      description: "Der CSV-Export wird in Kürze verfügbar sein."
    });
  };
  return <div className="space-y-6 py-0">
      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        

        

        
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">
            Zahlungsabwicklung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">Bezahlung auf Rechnung</p>
                <p className="text-sm text-gray-600">
                  Alle Bestellungen werden auf Rechnung abgewickelt. 
                  Sie erhalten eine Rechnung nach Abschluss der Bearbeitung.
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">Standard</Badge>
            </div>
            <p className="text-xs text-gray-500">
              Zahlungsziel: 14 Tage ab Rechnungsdatum.
            </p>
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
            <Button variant="outline" size="sm" onClick={handleExportAll}>
              <Download className="w-4 h-4 mr-2" />
              Alle exportieren
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {billingData?.orders.length ? <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rechnungs-Nr.</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingData.orders.map(order => <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {formatOrderId(order)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(order.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.packages?.name || 'Bildbearbeitung'}</p>
                        <p className="text-sm text-gray-500">{order.image_count} Bilder</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      €{parseFloat(order.total_price?.toString() || '0').toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {isAdmin || (order.order_invoices && order.order_invoices.length > 0) ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadInvoice(order)} 
                          title="Rechnung herunterladen"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Rechnung
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Rechnung demnächst verfügbar
                        </span>
                      )}
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table> : <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Noch keine Rechnungen vorhanden</p>
            </div>}
        </CardContent>
      </Card>
    </div>;
};

export default BillingOverview;
