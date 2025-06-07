
import React from 'react';
import { Shield, Zap, Award, Clock } from 'lucide-react';

const UploadInfo = () => {
  const features = [
    {
      icon: Shield,
      title: 'DSGVO-konform',
      description: 'Ihre Daten bleiben sicher und privat',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Zap,
      title: 'Schnelle Verarbeitung',
      description: 'Optimiert für beste Performance',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Award,
      title: 'Profi-Qualität',
      description: 'Studioqualität garantiert',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Clock,
      title: '48h Lieferung',
      description: 'Pünktlich und zuverlässig',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div 
            key={index}
            className="group p-4 bg-card border border-border rounded-lg hover:bg-muted/20 hover:border-primary/20 transition-all duration-200"
          >
            <div className={`inline-flex items-center justify-center w-8 h-8 ${feature.bg} rounded-lg mb-3 group-hover:scale-110 transition-transform duration-200`}>
              <Icon className={`w-4 h-4 ${feature.color}`} />
            </div>
            <h5 className="text-sm font-semibold text-foreground mb-1 tracking-tight">
              {feature.title}
            </h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default UploadInfo;
