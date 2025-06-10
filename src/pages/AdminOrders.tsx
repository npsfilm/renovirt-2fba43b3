
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EnhancedOrdersFilters from '@/components/admin/orders/EnhancedOrdersFilters';
import OrdersTable from '@/components/admin/orders/OrdersTable';
import OrderDetailsModal from '@/components/admin/orders/OrderDetailsModal';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState<Date | undefined>(undefined);
  const [dateToFilter, setDateToFilter] = useState<Date | undefined>(undefined);
  const [packageFilter, setPackageFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Echtzeit-Updates aktivieren
  useRealtimeOrders();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', searchTerm, statusFilter, paymentStatusFilter, dateFromFilter, dateToFilter, packageFilter],
    queryFn: async () => {
      console.log('Fetching orders with search term:', searchTerm);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer_profiles!fk_orders_customer_profiles (
            first_name,
            last_name,
            company,
            user_id
          ),
          order_images (
            id,
            file_name,
            file_size,
            file_type,
            storage_path,
            created_at
          ),
          packages (
            name
          )
        `)
        .neq('payment_flow_status', 'draft') // Entwurfsbestellungen ausschließen
        .order('created_at', { ascending: false });

      // Status-Filter anwenden
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (paymentStatusFilter !== 'all') {
        query = query.eq('payment_status', paymentStatusFilter);
      }

      // Datum-Filter anwenden
      if (dateFromFilter) {
        query = query.gte('created_at', dateFromFilter.toISOString());
      }

      if (dateToFilter) {
        const endDate = new Date(dateToFilter);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endDate.toISOString());
      }

      // Optimierte Suche für Bestellnummer und Kundenname
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.trim();
        console.log('Applying search for term:', term);
        
        // Verbesserte OR-Suche mit besserer Performance
        query = query.or(`
          order_number.ilike.%${term}%,
          customer_email.ilike.%${term}%,
          customer_profiles.first_name.ilike.%${term}%,
          customer_profiles.last_name.ilike.%${term}%,
          customer_profiles.company.ilike.%${term}%
        `);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      console.log('Orders fetched:', data?.length || 0);
      return data;
    },
    // Reduzierte Stale-Zeit für bessere Reaktivität bei Suche
    staleTime: searchTerm ? 0 : 30000,
    // Debouncing für bessere Performance bei schnellem Tippen
    enabled: true,
  });

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
    refetch(); // Bestellungen nach Schließen des Modals aktualisieren
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    setDateFromFilter(undefined);
    setDateToFilter(undefined);
    setPackageFilter('all');
  };

  return (
    <AdminLayout>
      {/* Kopfzeile */}
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

      {/* Hauptinhalt */}
      <main className="flex-1 p-6 space-y-6">
        <EnhancedOrdersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          paymentStatusFilter={paymentStatusFilter}
          setPaymentStatusFilter={setPaymentStatusFilter}
          dateFromFilter={dateFromFilter}
          setDateFromFilter={setDateFromFilter}
          dateToFilter={dateToFilter}
          setDateToFilter={setDateToFilter}
          packageFilter={packageFilter}
          setPackageFilter={setPackageFilter}
          onClearFilters={handleClearFilters}
        />
        
        <OrdersTable 
          orders={orders} 
          isLoading={isLoading} 
          onOrderSelect={handleOrderSelect}
        />
        
        {selectedOrderId && (
          <OrderDetailsModal
            orderId={selectedOrderId}
            isOpen={!!selectedOrderId}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminOrders;
