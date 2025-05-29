
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, FileText, RotateCcw, Plus, MessageSquare } from 'lucide-react';

const OrdersOverview = () => {
  const [filter, setFilter] = useState('all');
  
  // Mock data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-28',
      status: 'completed',
      statusLabel: 'Abgeschlossen',
      imageCount: 12,
      amount: '€156.00',
      service: 'Premium Retusche'
    },
    {
      id: 'ORD-002',
      date: '2024-01-25',
      status: 'processing',
      statusLabel: 'In Bearbeitung',
      imageCount: 8,
      amount: '€89.90',
      service: 'Standard Bearbeitung'
    },
    {
      id: 'ORD-003',
      date: '2024-01-20',
      status: 'completed',
      statusLabel: 'Abgeschlossen',
      imageCount: 5,
      amount: '€45.00',
      service: 'Basis Optimierung'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Ihre Bestellungen
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Datum
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'completed', label: 'Abgeschlossen' },
            { key: 'processing', label: 'In Bearbeitung' },
            { key: 'pending', label: 'Ausstehend' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.statusLabel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.service} • {order.imageCount} Bilder • {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Erneut bestellen
                </Button>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Nachbestellen
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Kommentieren
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersOverview;
