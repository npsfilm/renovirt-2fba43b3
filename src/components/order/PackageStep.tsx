
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Clock, Palette, Eye, Wand2, Sparkles } from 'lucide-react';

interface PackageStepProps {
  selectedPackage?: 'Basic' | 'Premium';
  onPackageChange: (pkg: 'Basic' | 'Premium') => void;
  onNext: () => void;
  onPrev: () => void;
}

const PackageStep = ({ selectedPackage, onPackageChange, onNext, onPrev }: PackageStepProps) => {
  const packages = [
    {
      id: 'Basic' as const,
      name: 'Basic',
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
      gradient: 'from-primary/10 to-primary/20',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      id: 'Premium' as const,
      name: 'Premium',
      price: '13.00€',
      priceUnit: 'pro Bild',
      description: 'Professionelle HDR-Bearbeitung & Detailretusche.',
      features: [
        { icon: Sparkles, text: 'Alle Basic-Features enthalten' },
        { icon: Wand2, text: 'Entfernung kleiner störender Objekte (manuell)' },
        { icon: Crown, text: 'Retusche sensibler Details' },
        { icon: Zap, text: 'Stil-Optimierung' },
        { icon: Clock, text: 'Priorisierte Bearbeitung' },
      ],
      popular: true,
      gradient: 'from-primary/10 to-primary/20',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ];

  const canProceed = selectedPackage !== undefined;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Wählen Sie Ihr Bearbeitungspaket</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Wählen Sie das Paket, das Ihren Anforderungen entspricht.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          const isPopular = pkg.popular;
          
          return (
            <Card
              key={pkg.id}
              className={`relative cursor-pointer transition-all duration-300 ease-out transform ${
                isSelected
                  ? 'ring-2 ring-primary border-primary shadow-lg scale-[1.02] bg-gradient-to-br ' + pkg.gradient
                  : 'hover:shadow-md hover:scale-[1.01] border-border bg-card'
              } ${isPopular ? 'border-primary/30' : ''}`}
              onClick={() => onPackageChange(pkg.id)}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-warning text-warning-foreground px-3 py-1 shadow-sm">
                    ⭐ BESTSELLER
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4 pt-6">
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pkg.iconBg}`}>
                    {pkg.id === 'Basic' ? (
                      <Zap className={`w-6 h-6 ${pkg.iconColor}`} />
                    ) : (
                      <Crown className={`w-6 h-6 ${pkg.iconColor}`} />
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-foreground">
                  {pkg.price}
                  <span className="text-sm font-normal text-muted-foreground ml-1">{pkg.priceUnit}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full mt-6 transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => onPackageChange(pkg.id)}
                >
                  {isSelected ? 'Ausgewählt' : 'Dieses Paket wählen'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <Button variant="outline" onClick={onPrev} className="shadow-sm">
          ← Zurück zu Upload
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[150px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
        >
          Weiter zur Übersicht →
        </Button>
      </div>
    </div>
  );
};

export default PackageStep;
