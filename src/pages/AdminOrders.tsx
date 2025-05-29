
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import OrdersFilters from '@/components/admin/orders/OrdersFilters';
import OrdersTable from '@/components/admin/orders/OrdersTable';

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
          customer_profiles!fk_orders_customer_profiles (
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
        <OrdersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <OrdersTable orders={orders} isLoading={isLoading} />
      </main>
    </AdminLayout>
  );
};

export default AdminOrders;
