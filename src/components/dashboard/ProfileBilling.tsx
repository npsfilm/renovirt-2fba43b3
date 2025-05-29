
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  CreditCard, 
  FileText, 
  Download,
  MapPin,
  Phone,
  Mail,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ProfileBilling = () => {
  const { user } = useAuth();

  const { data: customerProfile } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: recentInvoices } = useQuery({
    queryKey: ['user-invoices', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_price, created_at, status')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const userProfile = {
    name: customerProfile ? `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim() : user?.email?.split('@')[0] || 'Nutzer',
    email: user?.email || '',
    phone: customerProfile?.phone || '',
    company: customerProfile?.company || '',
    address: customerProfile?.address || ''
  };

  const paymentMethod = {
    type: 'Kreditkarte',
    last4: '****1234',
    expiry: '12/26'
  };

  const formatInvoiceId = (orderId: string) => {
    return `RE-${orderId.slice(0, 8).toUpperCase()}`;
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{userProfile.name}</p>
                {userProfile.company && (
                  <p className="text-sm text-gray-500">{userProfile.company}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{userProfile.email}</span>
              </div>
              {userProfile.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
              {userProfile.address && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.address}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Profil bearbeiten
          </Button>
        </CardContent>
      </Card>

      {/* Billing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Abrechnung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Method */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Zahlungsmethode</h4>
              <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {paymentMethod.type} {paymentMethod.last4}
                </p>
                <p className="text-xs text-gray-500">
                  Läuft ab {paymentMethod.expiry}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Aktuelle Rechnungen</h4>
            {recentInvoices?.length ? (
              <div className="space-y-2">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatInvoiceId(invoice.id)}</p>
                      <p className="text-xs text-gray-500">{new Date(invoice.created_at).toLocaleDateString('de-DE')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">€{parseFloat(invoice.total_price?.toString() || '0').toFixed(2)}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Noch keine Rechnungen vorhanden</p>
            )}
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Alle Rechnungen anzeigen
          </Button>
        </CardContent>
      </Card>

      {/* Marketing & Offers */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">
            🎯 Marketing & Angebote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-orange-100">
              <h4 className="font-medium text-gray-900 mb-1">
                Winter-Aktion: 20% Rabatt
              </h4>
              <p className="text-sm text-gray-600">
                Auf alle Premium-Pakete bis Ende Februar
              </p>
              <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                Jetzt nutzen
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Newsletter abonnieren für exklusive Angebote
              </p>
              <Button variant="link" size="sm" className="text-orange-600">
                Anmelden →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileBilling;
