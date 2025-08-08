
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Clock, Palette, Eye, Wand2, Sparkles, Cloud, Camera, RotateCw, Eraser, Edit, Home } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';

interface PackageStepProps {
  onNext: () => void;
  onPrev: () => void;
}
const PackageStep = ({ onNext, onPrev }: PackageStepProps) => {
  const selectedPackage = useOrderStore((state) => state.package);
  const setPackage = useOrderStore((state) => state.setPackage);

  // Preselect Premium if nothing is selected
  React.useEffect(() => {
    if (!selectedPackage) {
      setPackage('Premium');
    }
  }, [selectedPackage, setPackage]);
  const packages = [{
    id: 'Basic' as const,
    name: 'Basic',
    price: '9,00€',
    priceUnit: 'pro Bild',
    netPrice: 'netto',
    description: 'Grundlegende HDR-Entwicklung & Korrekturen.',
    features: [{
      icon: Palette,
      text: 'Farb- & Belichtungskorrektur'
    }, {
      icon: Home,
      text: 'Perspektivkorrekturen'
    }, {
      icon: Camera,
      text: 'Objektivkorrektur'
    }, {
      icon: Clock,
      text: 'Lieferung innerhalb 48h'
    }],
    popular: false,
    gradient: 'from-primary/10 to-primary/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary'
  }, {
    id: 'Premium' as const,
    name: 'Premium',
    price: '13,00€',
    priceUnit: 'pro Bild',
    netPrice: 'netto',
    description: 'Professionelle HDR-Bearbeitung & Detailretusche.',
    features: [{
      icon: Sparkles,
      text: 'Alle Basic-Features enthalten'
    }, {
      icon: Eraser,
      text: 'Entfernung störender Objekte'
    }, {
      icon: Edit,
      text: 'Retusche sensibler Details'
    }, {
      icon: Cloud,
      text: 'Himmelaustausch'
    }, {
      icon: Zap,
      text: 'Priorisierte Bearbeitung'
    }],
    popular: true,
    gradient: 'from-primary/10 to-primary/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary'
  }];
  const canProceed = selectedPackage !== undefined;
  return <div className="space-y-3 md:space-y-4">
      <div className="text-center space-y-1 px-3 md:px-0">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">Wählen Sie Ihr Bearbeitungspaket</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Wählen Sie das passende Paket für Ihre Bedürfnisse.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto px-3 md:px-0">
        {packages.map(pkg => {
        const isSelected = selectedPackage === pkg.id;
        const isPopular = pkg.popular;
        return <Card key={pkg.id} className={`relative cursor-pointer transition-all duration-300 ease-out transform flex flex-col rounded-2xl md:rounded-lg ${isSelected ? 'ring-2 ring-primary border-primary shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:shadow-lg scale-[1.02] bg-gradient-to-br ' + pkg.gradient : 'hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] md:hover:shadow-md hover:scale-[1.01] border-border bg-card shadow-[0_2px_8px_rgb(0,0,0,0.04)]'} ${isPopular ? 'border-primary/30' : ''}`} onClick={() => setPackage(pkg.id)}>
              {isPopular && <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-warning text-warning-foreground px-2 py-0.5 md:px-3 md:py-1 shadow-sm text-xs md:text-sm rounded-full">
                    ⭐ BESTSELLER
                  </Badge>
                </div>}
              
              <CardHeader className="text-center pb-2 md:pb-3 pt-4 md:pt-5 px-4 md:px-6">
                <div className="flex items-center justify-center mb-1 md:mb-2">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center ${pkg.iconBg}`}>
                    {pkg.id === 'Basic' ? <Zap className={`w-4 h-4 md:w-5 md:h-5 ${pkg.iconColor}`} /> : <Crown className={`w-4 h-4 md:w-5 md:h-5 ${pkg.iconColor}`} />}
                  </div>
                </div>
                <CardTitle className="text-lg md:text-xl font-semibold">{pkg.name}</CardTitle>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {pkg.price}
                  <span className="text-xs md:text-sm font-normal text-muted-foreground ml-1">/ {pkg.priceUnit}</span>
                </div>
                
                <p className="text-muted-foreground text-xs md:text-sm leading-tight md:leading-relaxed">{pkg.description}</p>
              </CardHeader>

              <CardContent className="space-y-2 md:space-y-3 pt-0 flex-1 flex flex-col px-4 md:px-6 pb-3 md:pb-4">
                <div className="space-y-1 md:space-y-2 flex-1">
                  {pkg.features.map((feature, index) => <div key={index} className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-2.5 h-2.5 md:w-3 md:h-3 text-success" />
                      </div>
                      <span className="text-xs md:text-sm text-foreground/80 leading-tight">{feature.text}</span>
                    </div>)}
                </div>

                <div className="mt-auto pt-2 md:pt-3">
                  <Button className={`w-full transition-all duration-200 h-9 md:h-10 text-sm rounded-xl md:rounded-md ${isSelected ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md' : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border'}`} onClick={() => setPackage(pkg.id)}>
                    {isSelected ? 'Ausgewählt' : 'Auswählen'}
                  </Button>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Alle Preise sind zzgl. 19% MwSt.
      </div>

      {/* Desktop Actions - hidden on mobile */}
      <div className="hidden md:flex justify-between max-w-4xl mx-auto">
        <Button variant="outline" onClick={onPrev} className="shadow-sm">
          ← Zurück zu Upload
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="min-w-[150px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
          Weiter zur Übersicht →
        </Button>
      </div>
    </div>;
};
export default PackageStep;
