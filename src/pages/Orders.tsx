
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText,
  Calendar,
  Image,
  Package
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          image_count,
          total_price,
          created_at,
          updated_at,
          photo_type,
          package_id,
          packages (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Fertig</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>;
      case 'payment_pending':
        return <Badge className="bg-orange-100 text-orange-800">Zahlung ausstehend</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Ausstehend</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unbekannt</Badge>;
    }
  };

  const formatOrderId = (id: string) => {
    return `ORD-${id.slice(0, 8).toUpperCase()}`;
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = formatOrderId(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.photo_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-xl font-semibold">Bestellungen</h1>
            </header>
            <main className="flex-1 p-6">
              <div className="text-center py-8">
                <p>Bestellungen werden geladen...</p>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Bestellungen</h1>
          </header>
          <main className="flex-1 p-6 space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Alle Bestellungen</h2>
                <p className="text-gray-600">Verwalten Sie Ihre Bildbearbeitungsaufträge</p>
              </div>
              <Button onClick={() => navigate('/order-flow')}>
                <Package className="w-4 h-4 mr-2" />
                Neue Bestellung
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Bestellung suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="processing">In Bearbeitung</SelectItem>
                      <SelectItem value="completed">Fertig</SelectItem>
                      <SelectItem value="payment_pending">Zahlung ausstehend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Bestellungsübersicht ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bestellungs-ID</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead>Paket</TableHead>
                        <TableHead>Bilder</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Betrag</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
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
                              <p className="font-medium">{order.packages?.name || 'Standard'}</p>
                              <p className="text-sm text-gray-500">{order.photo_type || 'Immobilienfotografie'}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Image className="w-4 h-4 text-gray-400" />
                              <span>{order.image_count} Bilder</span>
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
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
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
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Bestellungen gefunden</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Versuchen Sie, Ihre Suchkriterien zu ändern.'
                        : 'Sie haben noch keine Bestellungen aufgegeben.'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Button onClick={() => navigate('/order-flow')}>
                        <Package className="w-4 h-4 mr-2" />
                        Erste Bestellung erstellen
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Orders;
