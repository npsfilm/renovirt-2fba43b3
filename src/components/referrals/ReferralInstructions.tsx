
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, UserPlus, Gift, CheckCircle } from 'lucide-react';

const ReferralInstructions = () => {
  const steps = [
    {
      icon: Share2,
      title: 'Code teilen',
      description: 'Teilen Sie Ihren persönlichen Empfehlungscode mit Freunden und Kollegen.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: UserPlus,
      title: 'Registrierung',
      description: 'Ihre Kontakte registrieren sich mit Ihrem Code und erhalten 10 kostenlose Bilder.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Gift,
      title: 'Erste Bestellung',
      description: 'Nach der ersten erfolgreichen Bestellung erhalten Sie 10 kostenlose Bilder gutgeschrieben.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: CheckCircle,
      title: 'Belohnung erhalten',
      description: 'Die Bilder werden automatisch Ihrem Konto gutgeschrieben und können sofort verwendet werden.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>So funktioniert es</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Wichtige Hinweise:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Jeder empfohlene Nutzer erhält 10 kostenlose Bilder als Willkommensbonus</li>
            <li>• Sie erhalten 10 kostenlose Bilder nach der ersten erfolgreichen Bestellung Ihres Kontakts</li>
            <li>• Es gibt keine Begrenzung für die Anzahl der Empfehlungen</li>
            <li>• Belohnungen werden automatisch nach Zahlungseingang gutgeschrieben</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralInstructions;
