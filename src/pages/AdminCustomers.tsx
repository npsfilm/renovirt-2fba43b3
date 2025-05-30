
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, User, Mail, Phone, Building, FileText, ShoppingCart } from 'lucide-react';
import CustomerDetailsModal from '@/components/admin/customers/CustomerDetailsModal';
import CustomerOrdersModal from '@/components/admin/customers/CustomerOrdersModal';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerForOrders, setSelectedCustomerForOrders] = useState<{id: string, name: string} | null>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('customer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`
          first_name.ilike.%${searchTerm}%,
          last_name.ilike.%${searchTerm}%,
          company.ilike.%${searchTerm}%
        `);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', variant: 'destructive' as const },
      client: { label: 'Kunde', variant: 'default' as const },
      makler: { label: 'Makler', variant: 'secondary' as const },
      architekt: { label: 'Architekt', variant: 'secondary' as const },
      fotograf: { label: 'Fotograf', variant: 'secondary' as const },
      projektentwickler: { label: 'Projektentwickler', variant: 'secondary' as const },
      investor: { label: 'Investor', variant: 'secondary' as const },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: 'default' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDetailsClick = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleOrdersClick = (customerId: string, customerName: string) => {
    setSelectedCustomerForOrders({ id: customerId, name: customerName });
  };

  const handleAttachInvoice = (customerId: string) => {
    // TODO: Implement invoice attachment functionality
    console.log('Attach invoice for customer:', customerId);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Kunden verwalten</h1>
            <p className="text-sm text-gray-600">
              Alle registrierten Kunden anzeigen und verwalten ({customers?.length || 0} Kunden)
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nach Name oder Unternehmen suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Lade Kunden...</p>
            </div>
          ) : customers?.length ? (
            customers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          {getRoleBadge(customer.app_role)}
                          {customer.role && customer.role !== customer.app_role && (
                            getRoleBadge(customer.role)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.company && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{customer.company}</span>
                    </div>
                  )}
                  
                  {customer.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}

                  {customer.billing_email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{customer.billing_email}</span>
                    </div>
                  )}

                  {customer.industry && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Branche:</span> {customer.industry}
                    </div>
                  )}

                  {customer.responsibility && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Zuständigkeit:</span> {customer.responsibility}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Registriert: {new Date(customer.created_at).toLocaleDateString('de-DE')}
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleDetailsClick(customer.id)}
                    >
                      <User className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleOrdersClick(customer.id, `${customer.first_name} ${customer.last_name}`)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Bestellungen
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleAttachInvoice(customer.id)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Rechnung anhängen
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Keine Kunden gefunden</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CustomerDetailsModal
        customerId={selectedCustomerId}
        isOpen={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      <CustomerOrdersModal
        customerId={selectedCustomerForOrders?.id || null}
        customerName={selectedCustomerForOrders?.name || ''}
        isOpen={!!selectedCustomerForOrders}
        onClose={() => setSelectedCustomerForOrders(null)}
      />
    </AdminLayout>
  );
};

export default AdminCustomers;
