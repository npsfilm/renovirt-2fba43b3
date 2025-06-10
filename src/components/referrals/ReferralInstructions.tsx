
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gift, UserPlus, CheckCircle } from 'lucide-react';

const ReferralInstructions = () => {
  const steps = [
    {
      icon: Users,
      title: "Teilen Sie Ihren Code",
      description: "Geben Sie Ihren persönlichen Empfehlungscode an Freunde, Familie oder Geschäftspartner weiter."
    },
    {
      icon: UserPlus,
      title: "Neue Registrierung",
      description: "Ihr Kontakt registriert sich mit Ihrem Empfehlungscode bei Renovirt."
    },
    {
      icon: CheckCircle,
      title: "Erste Bestellung",
      description: "Sobald der neue Kunde seine erste Bestellung aufgibt, wird Ihre Empfehlung zur Freigabe vorgemerkt."
    },
    {
      icon: Gift,
      title: "Belohnung erhalten",
      description: "Nach Admin-Freigabe erhalten Sie 10 kostenfreie Bildbearbeitungen gutgeschrieben."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>So funktioniert unser Empfehlungsprogramm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-900">Wichtige Hinweise:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Nur der werbende Kunde erhält eine Belohnung (10 kostenfreie Bilder)</li>
            <li>• Die Freigabe erfolgt manuell durch unseren Administrator nach der ersten Bestellung</li>
            <li>• Credits werden automatisch Ihrem Konto gutgeschrieben</li>
            <li>• Keine Belohnung für Selbst-Empfehlungen möglich</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralInstructions;
