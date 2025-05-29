
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: { label: 'Ausstehend', variant: 'secondary' as const },
    processing: { label: 'In Bearbeitung', variant: 'default' as const },
    completed: { label: 'Abgeschlossen', variant: 'outline' as const },
    cancelled: { label: 'Storniert', variant: 'destructive' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default OrderStatusBadge;
