
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Eye, Download } from 'lucide-react';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer_profiles!orders_user_id_fkey(
            first_name,
            last_name,
            company,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`
          customer_profiles.first_name.ilike.%${searchTerm}%,
          customer_profiles.last_name.ilike.%${searchTerm}%,
          customer_profiles.company.ilike.%${searchTerm}%,
          customer_email.ilike.%${searchTerm}%
        `);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Ausstehend', variant: 'secondary' as const },
      processing: { label: 'In Bearbeitung', variant: 'default' as const },
      completed: { label: 'Abgeschlossen', variant: 'outline' as const },
      cancelled: { label: 'Storniert', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Bestellungen verwalten</h1>
            <p className="text-sm text-gray-600">
              Alle Kundenbestellungen anzeigen und verwalten
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter & Suche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nach Kunde, E-Mail oder Unternehmen suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Alle Status</option>
                <option value="pending">Ausstehend</option>
                <option value="processing">In Bearbeitung</option>
                <option value="completed">Abgeschlossen</option>
                <option value="cancelled">Storniert</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bestellungen ({orders?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Lade Bestellungen...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Bestell-ID</th>
                      <th className="text-left py-3 px-4 font-medium">Kunde</th>
                      <th className="text-left py-3 px-4 font-medium">E-Mail</th>
                      <th className="text-left py-3 px-4 font-medium">Bilder</th>
                      <th className="text-left py-3 px-4 font-medium">Betrag</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Datum</th>
                      <th className="text-left py-3 px-4 font-medium">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs">
                            #{order.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">
                              {order.customer_profiles?.first_name} {order.customer_profiles?.last_name}
                            </p>
                            {order.customer_profiles?.company && (
                              <p className="text-xs text-gray-500">{order.customer_profiles.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {order.customer_email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {order.image_count}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          €{parseFloat(order.total_price?.toString() || '0').toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(order.status || 'pending')}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('de-DE')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">
                          Keine Bestellungen gefunden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
};

export default AdminOrders;
