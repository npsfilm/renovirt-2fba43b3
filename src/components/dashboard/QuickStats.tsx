
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, CreditCard } from 'lucide-react';

const QuickStats = () => {
  const stats = [
    {
      title: "Aktive Bestellungen",
      value: "2",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Abgeschlossen",
      value: "12",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Gesamt Bestellungen",
      value: "14",
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Offene Rechnung",
      value: "€89.90",
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
