
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Building, Phone } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface CustomerDetailsProps {
  order: ExtendedOrder | undefined;
}

const CustomerDetails = ({ order }: CustomerDetailsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4" />
          Kunde
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {order?.customer_profiles?.first_name} {order?.customer_profiles?.last_name}
          </span>
        </div>

        {order?.customer_profiles?.company && (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{order.customer_profiles.company}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{order?.customer_email}</span>
        </div>

        {order?.customer_profiles?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{order.customer_profiles.phone}</span>
          </div>
        )}

        {order?.admin_notes && (
          <div className="pt-2 border-t">
            <span className="text-xs text-gray-500 block mb-1">Admin-Notizen</span>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {order.admin_notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
