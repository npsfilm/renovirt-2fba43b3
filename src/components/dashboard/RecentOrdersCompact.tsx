
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, Download } from 'lucide-react';

const RecentOrdersCompact = () => {
  const recentOrders = [
    {
      id: 'ORD-001',
      status: 'completed',
      statusLabel: 'Fertig',
      imageCount: 12,
      date: '28.01.2024'
    },
    {
      id: 'ORD-002',
      status: 'processing',
      statusLabel: 'In Bearbeitung',
      imageCount: 8,
      date: '25.01.2024'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">Letzte Bestellungen</CardTitle>
        <Button variant="ghost" size="sm">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-500">{order.imageCount} Bilder • {order.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                {order.statusLabel}
              </Badge>
              {order.status === 'completed' && (
                <Button variant="ghost" size="sm">
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersCompact;
