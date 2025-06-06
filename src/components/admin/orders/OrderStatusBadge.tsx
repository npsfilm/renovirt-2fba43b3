
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: { label: 'Ausstehend', className: 'bg-warning text-warning-foreground' },
    processing: { label: 'In Bearbeitung', className: 'bg-primary text-primary-foreground' },
    completed: { label: 'Abgeschlossen', className: 'bg-success text-success-foreground' },
    cancelled: { label: 'Storniert', className: 'bg-error text-error-foreground' },
    quality_check: { label: 'Qualitätsprüfung', className: 'bg-accent text-accent-foreground' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || 
                 { label: status, className: 'bg-secondary text-secondary-foreground' };
  
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default OrderStatusBadge;
