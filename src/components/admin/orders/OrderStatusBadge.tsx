
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: { label: 'Warteschlange', className: 'bg-warning text-warning-foreground' },
    processing: { label: 'In Bearbeitung', className: 'bg-primary text-primary-foreground' },
    quality_check: { label: 'Überprüfung', className: 'bg-accent text-accent-foreground' },
    revision: { label: 'In Revision', className: 'bg-orange-100 text-orange-800' },
    completed: { label: 'Abgeschlossen', className: 'bg-success text-success-foreground' },
    delivered: { label: 'Abgeschlossen & bezahlt', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Storniert', className: 'bg-error text-error-foreground' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || 
                 { label: status, className: 'bg-secondary text-secondary-foreground' };
  
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default OrderStatusBadge;
