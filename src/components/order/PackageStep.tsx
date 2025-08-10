
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Clock, Palette, Sparkles, Cloud, Camera, Eraser, Edit, Home, ShieldCheck, Check, X } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePostHog } from '@/contexts/PostHogProvider';

interface PackageStepProps {
  onNext: () => void;
  onPrev: () => void;
}
const PackageStep = ({ onNext, onPrev }: PackageStepProps) => {
  const selectedPackage = useOrderStore((state) => state.package);
  const setPackage = useOrderStore((state) => state.setPackage);
  const isMobile = useIsMobile();
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsPkgId, setDetailsPkgId] = React.useState<'Basic' | 'Premium' | null>(null);
  const [detailsTab, setDetailsTab] = React.useState<'details' | 'compare'>('details');
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(selectedPackage === 'Basic' ? 0 : 1);
  const posthog = usePostHog();

  // Sync carousel selection and listen to changes
  React.useEffect(() => {
    if (!carouselApi) return;
    const initialIndex = selectedPackage === 'Basic' ? 0 : 1;
    try {
      carouselApi.scrollTo(initialIndex, true);
    } catch {}
    const onSelect = () => setSelectedIndex(carouselApi.selectedScrollSnap());
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // Preselect Premium if nothing is selected
  React.useEffect(() => {
    if (!selectedPackage) {
      setPackage('Premium');
    }
  }, [selectedPackage]); // Removed setPackage from dependencies
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

{isMobile ? (
        <div className="max-w-md mx-auto px-3 md:px-0 animate-fade-in" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>
          {/* Simplified Trust Bar */}
          <div className="mb-6 flex items-center justify-center gap-6 text-xs text-foreground/70">
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /><span>48h Lieferung</span></div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /><span>Sichere Abwicklung</span></div>
          </div>

          <Carousel opts={{ loop: true, align: 'start' }} setApi={setCarouselApi}>
            <CarouselContent>
              {packages.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <CarouselItem key={pkg.id} className="basis-full">
                    <Card
                      className={`relative cursor-pointer transition-all duration-300 ease-out transform flex flex-col rounded-2xl ${
                        isSelected
                          ? 'ring-2 ring-primary border-primary shadow-lg bg-background'
                          : 'hover:shadow-md hover:scale-[1.01] border-border bg-card'
                      }`}
                      onClick={() => setPackage(pkg.id)}
                    >
                      <CardHeader className="text-center pb-4 pt-6 px-6">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            {pkg.id === 'Basic' ? (
                              <Zap className="w-6 h-6 text-foreground" />
                            ) : (
                              <Crown className="w-6 h-6 text-foreground" />
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-semibold mb-2">{pkg.name}</CardTitle>
                        <div className="text-3xl font-bold text-foreground mb-3">
                          {pkg.price}
                          <span className="text-sm font-normal text-muted-foreground ml-1">/ {pkg.priceUnit}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 flex-1 flex flex-col px-6 pb-6">
                        <div className="space-y-3 flex-1 mb-6">
                          {pkg.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="text-sm text-foreground leading-tight">{feature.text}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          className={`w-full transition-all duration-200 h-12 text-base rounded-xl ${
                            isSelected
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPackage(pkg.id);
                          }}
                        >
                          {isSelected ? 'Ausgewählt' : 'Auswählen'}
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Simplified Pagination - only dots */}
          <div className="mt-6 flex justify-center gap-2">
            {packages.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-all ${selectedIndex === i ? 'bg-primary w-6' : 'bg-muted'}`}
                onClick={() => {
                  setSelectedIndex(i);
                  if (carouselApi) carouselApi.scrollTo(i);
                }}
              />
            ))}
          </div>

          <Sheet open={detailsOpen} onOpenChange={(open) => { setDetailsOpen(open); if (open && detailsPkgId) { posthog.capture('package_details_opened', { package: detailsPkgId }); } }}>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              {detailsPkgId && (() => {
                const pkg = packages.find((p) => p.id === detailsPkgId)!;
                const isSelected = selectedPackage === pkg.id;
                const allFeatures = Array.from(new Set(packages.flatMap((p) => p.features.map((f) => f.text))));
                return (
                  <>
                    <SheetHeader>
                      <SheetTitle>{pkg.name}</SheetTitle>
                      <SheetDescription>{pkg.description}</SheetDescription>
                    </SheetHeader>

                    <Tabs value={detailsTab} onValueChange={(v) => { setDetailsTab(v as 'details' | 'compare'); if (v === 'compare') { posthog.capture('package_compare_opened', { package: detailsPkgId }); } }} className="px-4">
                      <TabsList className="w-full grid grid-cols-2 mb-3">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="compare">Vergleich</TabsTrigger>
                      </TabsList>

                      <TabsContent value="details">
                        <div className="pb-4 space-y-3">
                          <div className="text-2xl font-bold">
                            {pkg.price}
                            <span className="text-sm font-normal text-muted-foreground ml-1">/ {pkg.priceUnit}</span>
                          </div>
                          <div className="space-y-2">
                            {pkg.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <feature.icon className="w-4 h-4" />
                                <span className="text-sm text-foreground/90">{feature.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="compare">
                        <div className="pb-4 space-y-2">
                          {allFeatures.map((f) => {
                            const basicHas = packages[0].features.some((fe) => fe.text === f);
                            const premiumHas = packages[1].features.some((fe) => fe.text === f);
                            return (
                              <div key={f} className="flex items-center justify-between text-sm py-2 border-b last:border-b-0 border-border">
                                <span className="text-foreground/90">{f}</span>
                                <div className="flex items-center gap-6">
                                  <span className="flex items-center gap-1.5">{basicHas ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Basic</span>
                                  <span className="flex items-center gap-1.5">{premiumHas ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Premium</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </TabsContent>
                    </Tabs>

                    <SheetFooter className="px-4 pb-4">
                      <Button
                        className={`w-full h-10 rounded-xl ${
                          isSelected
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
                            : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                        }`}
                        onClick={() => {
                          setPackage(pkg.id);
                          setDetailsOpen(false);
                        }}
                      >
                        {isSelected ? 'Ausgewählt' : 'Auswählen'}
                      </Button>
                      <SheetClose asChild>
                        <Button variant="outline" className="h-10 rounded-xl">Schließen</Button>
                      </SheetClose>
                    </SheetFooter>
                  </>
                );
              })()}
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto px-3 md:px-0">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            const isPopular = pkg.popular;
            return (
              <Card
                key={pkg.id}
                className={`relative cursor-pointer transition-all duration-300 ease-out transform flex flex-col rounded-2xl md:rounded-lg ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:shadow-lg scale-[1.02] bg-gradient-to-br ' + pkg.gradient
                    : 'hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] md:hover:shadow-md hover:scale-[1.01] border-border bg-card shadow-[0_2px_8px_rgb(0,0,0,0.04)]'
                } ${isPopular ? 'border-primary/30' : ''}`}
                onClick={() => setPackage(pkg.id)}
              >
                {isPopular && (
                  <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-warning text-warning-foreground px-2 py-0.5 md:px-3 md:py-1 shadow-sm text-xs md:text-sm rounded-full">
                      Bestseller
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2 md:pb-3 pt-4 md:pt-5 px-4 md:px-6">
                  <div className="flex items-center justify-center mb-1 md:mb-2">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center ${pkg.iconBg}`}>
                      {pkg.id === 'Basic' ? (
                        <Zap className={`w-4 h-4 md:w-5 md:h-5 ${pkg.iconColor}`} />
                      ) : (
                        <Crown className={`w-4 h-4 md:w-5 md:h-5 ${pkg.iconColor}`} />
                      )}
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
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-2.5 h-2.5 md:w-3 md:h-3 text-success" />
                        </div>
                        <span className="text-xs md:text-sm text-foreground/80 leading-tight">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-2 md:pt-3">
                    <Button
                      className={`w-full transition-all duration-200 h-9 md:h-10 text-sm rounded-xl md:rounded-md ${
                        isSelected
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border'
                      }`}
                      onClick={() => setPackage(pkg.id)}
                    >
                      {isSelected ? 'Ausgewählt' : 'Auswählen'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}


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
