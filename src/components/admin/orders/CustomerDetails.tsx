
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface CustomerDetailsProps {
  order: ExtendedOrder | undefined;
}

const CustomerDetails = ({ order }: CustomerDetailsProps) => {
  const handleOpenCustomerProfile = () => {
    if (order?.customer_profiles?.first_name || order?.customer_profiles?.last_name) {
      // Open customer profile in new tab - would need customer ID
      window.open(`/admin/customers?search=${order.customer_email}`, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Kundeninformationen
          </div>
          {order?.customer_profiles && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenCustomerProfile}
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Profil
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {order?.customer_profiles ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {order.customer_profiles.first_name} {order.customer_profiles.last_name}
              </span>
            </div>
            
            {order.customer_profiles.company && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{order.customer_profiles.company}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{order.customer_email}</span>
            </div>
            
            {order.customer_profiles.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{order.customer_profiles.phone}</span>
              </div>
            )}
            
            {order.customer_profiles.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{order.customer_profiles.address}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{order?.customer_email || 'Keine E-Mail'}</span>
            </div>
            <p className="text-xs text-gray-500">
              Kein vollständiges Kundenprofil verfügbar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
