
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Phone, Building, MapPin, Briefcase, FileText, Calendar } from 'lucide-react';

interface CustomerDetailsModalProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsModal = ({ customerId, isOpen, onClose }: CustomerDetailsModalProps) => {
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer-details', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!customerId,
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', variant: 'destructive' as const },
      client: { label: 'Kunde', variant: 'default' as const },
      makler: { label: 'Makler', variant: 'secondary' as const },
      architekt: { label: 'Architekt', variant: 'secondary' as const },
      fotograf: { label: 'Fotograf', variant: 'secondary' as const },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: 'default' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {customer.first_name} {customer.last_name}
              </h2>
              <div className="flex gap-2 mt-1">
                {getRoleBadge(customer.app_role)}
                {customer.role && customer.role !== customer.app_role && (
                  getRoleBadge(customer.role)
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Kontaktdaten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{customer.phone}</span>
                </div>
              )}
              
              {customer.billing_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{customer.billing_email}</span>
                </div>
              )}

              {customer.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <span>{customer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="w-5 h-5" />
                Unternehmen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.company && (
                <div>
                  <span className="font-medium">Firma:</span> {customer.company}
                </div>
              )}
              
              {customer.industry && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>{customer.industry}</span>
                </div>
              )}

              {customer.responsibility && (
                <div>
                  <span className="font-medium">Zuständigkeit:</span> {customer.responsibility}
                </div>
              )}

              {customer.vat_id && (
                <div>
                  <span className="font-medium">USt-IdNr.:</span> {customer.vat_id}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Weitere Informationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.data_source && (
                <div>
                  <span className="font-medium">Datenquelle:</span> {customer.data_source}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">E-Mail Updates:</span>
                  <Badge variant={customer.order_updates ? 'default' : 'secondary'}>
                    {customer.order_updates ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">SMS:</span>
                  <Badge variant={customer.sms_notifications ? 'default' : 'secondary'}>
                    {customer.sms_notifications ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Marketing:</span>
                  <Badge variant={customer.marketing_emails ? 'default' : 'secondary'}>
                    {customer.marketing_emails ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Registriert: {new Date(customer.created_at).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
