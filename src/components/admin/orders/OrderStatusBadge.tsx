
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: { label: 'Ausstehend', className: 'bg-status-pending text-foreground' },
    processing: { label: 'In Bearbeitung', className: 'bg-status-processing text-white' },
    completed: { label: 'Abgeschlossen', className: 'bg-status-completed text-white' },
    cancelled: { label: 'Storniert', className: 'bg-status-cancelled text-white' },
    quality_check: { label: 'Qualitätsprüfung', className: 'bg-status-quality-check text-white' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || 
                 { label: status, className: 'bg-secondary text-secondary-foreground' };
  
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default OrderStatusBadge;
