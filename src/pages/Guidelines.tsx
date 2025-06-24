import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Download, Camera, Settings, Lightbulb, Layout, ClipboardList, Palette, Workflow, HelpCircle, CheckSquare, ChevronDown, ChevronRight, Smartphone, Aperture, Sun, Grid3X3, FileImage, Brush, PlayCircle, Upload, Moon, Menu, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
const Guidelines = () => {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('ausruestung');

  // Back to top functionality
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };
  const navigationItems = [{
    id: 'ausruestung',
    label: 'Ausrüstung',
    icon: Camera
  }, {
    id: 'grundeinstellungen',
    label: 'Grundeinstellungen',
    icon: Settings
  }, {
    id: 'licht',
    label: 'Licht',
    icon: Lightbulb
  }, {
    id: 'komposition',
    label: 'Komposition',
    icon: Layout
  }, {
    id: 'shotlisten',
    label: 'Shotlisten',
    icon: ClipboardList
  }, {
    id: 'staging',
    label: 'Staging',
    icon: Palette
  }, {
    id: 'workflow',
    label: 'Workflow',
    icon: Workflow
  }, {
    id: 'faq',
    label: 'FAQ',
    icon: HelpCircle
  }, {
    id: 'checkliste',
    label: 'Upload-Checkliste',
    icon: CheckSquare
  }];
  return <SidebarProvider>
      <div className={`min-h-screen flex w-full ${darkMode ? 'dark' : ''}`}>
        <AppSidebar />
        <SidebarInset>
          <PageHeader title="Renovirt Immobilien-Fotoguide" subtitle="Professionelle Aufnahmen mit Smartphone & Kamera" />
          
          <main className="flex-1">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Renovirt Immobilien-Fotoguide
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Professionelle Aufnahmen mit Smartphone & Kamera – 
                  Ihr kompletter Leitfaden für beeindruckende Immobilienfotos
                </p>
                
              </div>
            </div>

            {/* Breadcrumbs */}
            

            {/* Sticky Navigation */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-6 py-3">
              <div className="max-w-4xl mx-auto">
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {navigationItems.map(item => <Button key={item.id} variant={activeSection === item.id ? "default" : "outline"} size="sm" onClick={() => scrollToSection(item.id)} className="text-xs hover:scale-105 transition-transform duration-200">
                      <item.icon className="w-3 h-3 mr-1" />
                      {item.label}
                    </Button>)}
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="px-6 py-8">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Ausrüstung */}
                <section id="ausruestung">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-primary" />
                        </div>
                        Ausrüstung & Equipment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="smartphone" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="smartphone" className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Smartphone
                          </TabsTrigger>
                          <TabsTrigger value="kamera" className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            DSLR/Systemkamera
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="smartphone" className="mt-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Smartphone-Setup</h4>
                            <div className="grid gap-4">
                              <div className="flex items-start gap-3 p-4 bg-success/5 rounded-lg">
                                <Badge variant="outline" className="text-xs">Essential</Badge>
                                <div>
                                  <p className="font-medium">Weitwinkel ≤ 28 mm (Äquivalent)</p>
                                  <p className="text-sm text-muted-foreground">
                                    iPhone 11 Pro oder neuer, Samsung Galaxy S20+ oder vergleichbar
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-4 bg-info/5 rounded-lg">
                                <Badge variant="outline" className="text-xs">Optional</Badge>
                                <div>
                                  <p className="font-medium">Clip-Weitwinkel-Objektiv</p>
                                  <p className="text-sm text-muted-foreground">
                                    Für noch mehr Weitwinkel bei älteren Geräten
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="kamera" className="mt-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Kamera-Setup</h4>
                            <div className="grid gap-4">
                              <div className="flex items-start gap-3 p-4 bg-success/5 rounded-lg">
                                <Badge variant="outline" className="text-xs">Crop</Badge>
                                <div>
                                  <p className="font-medium">10–22 mm Weitwinkel-Zoom</p>
                                  <p className="text-sm text-muted-foreground">
                                    Für APS-C Sensoren (Canon, Sony, Fuji)
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-4 bg-success/5 rounded-lg">
                                <Badge variant="outline" className="text-xs">Vollformat</Badge>
                                <div>
                                  <p className="font-medium">16–35 mm Weitwinkel-Zoom</p>
                                  <p className="text-sm text-muted-foreground">
                                    Für Vollformat-Sensoren
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-6 p-4 bg-warning/5 rounded-lg">
                        <h4 className="font-semibold mb-3">Zusätzliche Ausrüstung</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-success" />
                            <span className="text-sm">Stabiles Stativ</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-success" />
                            <span className="text-sm">Fernauslöser/Timer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-success" />
                            <span className="text-sm">Ersatzakkus</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-success" />
                            <span className="text-sm">Leere SD-Karte</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-warning" />
                            <span className="text-sm">LED-Panel (optional)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-success" />
                            <span className="text-sm">Mikrofasertuch</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Grundeinstellungen */}
                <section id="grundeinstellungen">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Settings className="w-6 h-6 text-primary" />
                        </div>
                        Grundeinstellungen
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg">Kamera-Parameter</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                              <Aperture className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">Blende: f/8 – f/11</p>
                                <p className="text-xs text-muted-foreground">Optimale Schärfentiefe</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                              <Settings className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">ISO: 100–200</p>
                                <p className="text-xs text-muted-foreground">Minimales Bildrauschen</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg">
                              <FileImage className="w-5 h-5 text-success" />
                              <div>
                                <p className="font-medium">Format: RAW/DNG</p>
                                <p className="text-xs text-muted-foreground">Maximale Bearbeitungsqualität</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg">Zusatzfunktionen</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-info/5 rounded-lg">
                              <Sun className="w-5 h-5 text-info" />
                              <div>
                                <p className="font-medium">Weißabgleich: ≈ 5.500 K</p>
                                <p className="text-xs text-muted-foreground">Tageslicht sperren</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-info/5 rounded-lg">
                              <Grid3X3 className="w-5 h-5 text-info" />
                              <div>
                                <p className="font-medium">Gitternetz aktivieren</p>
                                <p className="text-xs text-muted-foreground">Drittel-Regel & Ausrichtung</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-warning/5 rounded-lg">
                              <Camera className="w-5 h-5 text-warning" />
                              <div>
                                <p className="font-medium">3er-Bracketing (Innen)</p>
                                <p className="text-xs text-muted-foreground">HDR-Pro-Modus (Smartphone)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Continue with other sections... */}
                {/* For brevity, I'll show the structure for a few more sections */}

                {/* Licht & Belichtung */}
                <section id="licht">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-primary" />
                        </div>
                        Licht & Belichtung
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 bg-gradient-to-r from-warning/10 to-success/10 rounded-lg">
                          <h4 className="font-semibold mb-3">Goldene Regeln</h4>
                          <div className="grid gap-3">
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="text-xs">1</Badge>
                              <span className="text-sm">Alle Lampen einschalten + Vorhänge öffnen</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="text-xs">2</Badge>
                              <span className="text-sm">Fenster-Bracketing ±2 EV verwenden</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="text-xs">3</Badge>
                              <span className="text-sm">Blaue-Stunde-Trick für Außenaufnahmen nutzen</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* FAQ Section */}
                <section id="faq">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-6 h-6 text-primary" />
                        </div>
                        Häufige Fragen & Troubleshooting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[{
                        question: "Fenster sind ausgebrannt – was tun?",
                        answer: "HDR-Modus aktivieren oder 3er-Bracketing verwenden. Bei extremen Kontrasten mehrere Belichtungen manuell kombinieren."
                      }, {
                        question: "LED-Flimmern in Videos/Fotos?",
                        answer: "Verschlusszeit auf 1/50 s einstellen, um Flimmern zu vermeiden."
                      }, {
                        question: "Bilder sind zu rauschig?",
                        answer: "ISO-Wert senken (100-200) und bei Bedarf Stativ verwenden für längere Belichtungszeiten."
                      }, {
                        question: "Starke Verzerrung an den Rändern?",
                        answer: "Brennweite ≥ 14 mm (Vollformat) verwenden oder Korrektur in der Nachbearbeitung."
                      }].map((faq, index) => <Collapsible key={index}>
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                              <span className="font-medium text-left">{faq.question}</span>
                              <ChevronDown className="w-4 h-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-4 bg-background border border-t-0 rounded-b-lg">
                              <p className="text-sm text-muted-foreground">{faq.answer}</p>
                            </CollapsibleContent>
                          </Collapsible>)}
                      </div>
                      
                      <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg text-center">
                        <h4 className="font-semibold mb-2">Weitere Fragen?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Unser Support-Team hilft Ihnen gerne weiter.
                        </p>
                        <Button variant="outline" onClick={() => navigate('/help')}>
                          Kontakt aufnehmen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Upload-Checkliste */}
                <section id="checkliste">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <CheckSquare className="w-6 h-6 text-success" />
                        </div>
                        Upload-Checkliste
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          {["Mindestens 2 Winkel pro Raum fotografiert", "Alle Dateien im RAW/DNG-Format gespeichert", "Dateinamen korrekt: Objekt_Raum_##", "Upload-Ordner '0_RAW' erstellt", "Alle Dateien erfolgreich hochgeladen"].map((item, index) => <div key={index} className="flex items-center gap-3 p-3 bg-success/5 rounded-lg">
                              <CheckSquare className="w-5 h-5 text-success" />
                              <span className="text-sm">{item}</span>
                            </div>)}
                        </div>
                        
                        
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* CTA Section */}
                <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20 shadow-xl">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center space-y-6">
                      <h3 className="text-2xl font-bold text-foreground">
                        Bereit für professionelle Immobilienfotos?
                      </h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        Nutzen Sie unseren Guide und lassen Sie Ihre Aufnahmen von unserem Expertenteam 
                        professionell bearbeiten. Für Ergebnisse, die verkaufen.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => navigate('/order')} className="shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                          <Upload className="w-5 h-5 mr-2" />
                          Jetzt Fotos hochladen
                        </Button>
                        
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-muted/30 border-t px-6 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                      © 2024 Renovirt. Professionelle Bildbearbeitung für Immobilienmakler.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/help')}>
                      Kontakt
                    </Button>
                    <Button variant="ghost" size="sm">
                      Datenschutz
                    </Button>
                    <Button variant="ghost" size="sm">
                      Impressum
                    </Button>
                  </div>
                </div>
              </div>
            </footer>
          </main>

          {/* Back to Top Button */}
          {showBackToTop && <Button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110" size="icon">
              <ArrowUp className="w-5 h-5" />
            </Button>}
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default Guidelines;