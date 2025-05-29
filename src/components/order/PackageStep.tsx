
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Diamond, Clock, Palette, Eye, Wand2 } from 'lucide-react';

interface PackageStepProps {
  selectedPackage?: 'basic' | 'premium';
  onPackageChange: (pkg: 'basic' | 'premium') => void;
  onNext: () => void;
  onPrev: () => void;
}

const PackageStep = ({ selectedPackage, onPackageChange, onNext, onPrev }: PackageStepProps) => {
  const packages = [
    {
      id: 'basic' as const,
      name: 'Basic HDR',
      price: '9.00€',
      priceUnit: 'pro Bild',
      description: 'Grundlegende HDR-Entwicklung & Korrekturen.',
      features: [
        { icon: Palette, text: 'Farb- & Belichtungskorrektur' },
        { icon: Eye, text: 'Perspektivkorrekturen' },
        { icon: Wand2, text: 'Objektivkorrektur' },
        { icon: Clock, text: 'Lieferung innerhalb 48h' },
      ],
      popular: false,
    },
    {
      id: 'premium' as const,
      name: 'Premium HDR & Retusche',
      price: '13.00€',
      priceUnit: 'pro Bild',
      description: 'Professionelle HDR-Bearbeitung & Detailretusche.',
      features: [
        { icon: Star, text: 'Alle Basic-Features enthalten' },
        { icon: Wand2, text: 'Entfernung kleiner störender Objekte (manuell)' },
        { icon: Diamond, text: 'Retusche sensibler Details' },
        { icon: Star, text: 'Stil-Optimierung' },
        { icon: Clock, text: 'Priorisierte Bearbeitung' },
      ],
      popular: true,
    },
  ];

  const canProceed = selectedPackage !== undefined;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wählen Sie Ihr Bearbeitungspaket & Optionen</h1>
        <p className="text-gray-600">Wählen Sie das Paket und die Zusatzoptionen, die Ihren Anforderungen entsprechen.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedPackage === pkg.id
                ? 'ring-2 ring-green-500 border-green-500'
                : 'hover:shadow-lg'
            } ${pkg.popular ? 'border-green-400' : ''}`}
            onClick={() => onPackageChange(pkg.id)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-yellow-900 px-3 py-1">
                  ⭐ BESTSELLER
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                {pkg.id === 'basic' ? (
                  <Star className="w-6 h-6 text-blue-600" />
                ) : (
                  <Diamond className="w-6 h-6 text-green-600" />
                )}
              </div>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                {pkg.price}
                <span className="text-sm font-normal text-gray-600 ml-1">{pkg.priceUnit}</span>
              </div>
              <p className="text-gray-600 text-sm">{pkg.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  selectedPackage === pkg.id
                    ? 'bg-green-600 hover:bg-green-700'
                    : pkg.popular
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                onClick={() => onPackageChange(pkg.id)}
              >
                {selectedPackage === pkg.id ? 'Ausgewählt' : 'Dieses Paket wählen'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          ← Zurück zu Upload
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[150px]"
        >
          Weiter zur Übersicht →
        </Button>
      </div>
    </div>
  );
};

export default PackageStep;
