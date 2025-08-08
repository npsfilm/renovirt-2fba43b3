import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Download, Camera, Settings, Lightbulb, Layout, ClipboardList, Palette, Workflow, HelpCircle, CheckSquare, ChevronDown, ChevronRight, Smartphone, Aperture, Sun, Grid3X3, FileImage, Brush, PlayCircle, Upload, Moon, Menu, Home, Star, Clock, Zap, Eye, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
const Guidelines = () => {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('equipment');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  const navigationItems = [{
    id: 'equipment',
    label: 'Ausrüstung',
    icon: Camera
  }, {
    id: 'settings',
    label: 'Grundeinstellungen',
    icon: Settings
  }, {
    id: 'lighting',
    label: 'Licht & Belichtung',
    icon: Lightbulb
  }, {
    id: 'composition',
    label: 'Komposition',
    icon: Layout
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
    id: 'checklist',
    label: 'Upload-Checkliste',
    icon: CheckSquare
  }];
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader title="Renovirt Immobilien-Fotoguide" subtitle="Professionelle Aufnahmen mit Smartphone & Kamera" />
          
          <main className="flex-1">
            {/* Hero Section - Airbnb-style */}
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-6 overflow-hidden">
              <div className="absolute inset-0 opacity-20"></div>
              <div className="relative max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 mb-6">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Professioneller Leitfaden</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Renovirt Immobilien-<br />
                  <span className="text-primary">Fotoguide</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                  Von Equipment-Empfehlungen bis zur perfekten Aufnahme – 
                  Ihr kompletter Leitfaden für beeindruckende Immobilienfotos mit Smartphone & Kamera
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => scrollToSection('equipment')} className="hover-scale">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Guide starten
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/order-flow')} className="hover-scale">
                    <Upload className="w-5 h-5 mr-2" />
                    Fotos hochladen
                  </Button>
                </div>
              </div>
            </div>

            {/* Breadcrumbs - Airbnb-style */}
            <div className="px-6 py-4 border-b bg-background/50 backdrop-blur-sm">
              <div className="max-w-5xl mx-auto">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => navigate('/')} className="hover:text-primary cursor-pointer">
                        <Home className="w-4 h-4" />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Foto-Guidelines</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            {/* Horizontal Tab Navigation - Airbnb-style */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b shadow-sm">
              <div className="max-w-5xl mx-auto px-6 py-4">
                <div className="flex overflow-x-auto no-scrollbar gap-2">
                  {navigationItems.map(item => (
                    <Button 
                      key={item.id} 
                      variant={activeSection === item.id ? "default" : "ghost"} 
                      size="sm" 
                      onClick={() => scrollToSection(item.id)} 
                      className={`flex-shrink-0 transition-all duration-200 ${
                        activeSection === item.id 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-muted hover-scale'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                </div>
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">~15 Min Lesezeit</span>
                  <div className="flex-1 h-1 bg-muted rounded-full ml-2">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((navigationItems.findIndex(item => item.id === activeSection) + 1) / navigationItems.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections - Airbnb-style */}
            <div className="px-6 py-12">
              <div className="max-w-5xl mx-auto space-y-16">
                
                {/* Quick Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  <Card className="group hover:shadow-lg transition-all duration-300 hover-scale border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Schnellstart</h3>
                      <p className="text-sm text-muted-foreground">Sofort loslegen mit Smartphone oder Kamera</p>
                    </CardContent>
                  </Card>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover-scale border-0 bg-gradient-to-br from-accent/5 to-accent/10">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Eye className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-2">Profi-Tipps</h3>
                      <p className="text-sm text-muted-foreground">Bewährte Techniken für beste Ergebnisse</p>
                    </CardContent>
                  </Card>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover-scale border-0 bg-gradient-to-br from-success/5 to-success/10">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-8 h-8 text-success" />
                      </div>
                      <h3 className="font-semibold mb-2">Garantiert</h3>
                      <p className="text-sm text-muted-foreground">Professionelle Qualität in jeder Aufnahme</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Ausrüstung */}
                <section id="equipment" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Ausrüstung & Equipment</h2>
                        <p className="text-muted-foreground">Das richtige Equipment für professionelle Aufnahmen</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <Star className="w-3 h-3 mr-1" />
                      Essentiell
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
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
                        
                        <TabsContent value="smartphone" className="mt-8">
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                              <Smartphone className="w-6 h-6 text-primary" />
                              <h4 className="font-semibold text-xl">Smartphone-Setup</h4>
                            </div>
                            <div className="grid gap-6">
                              <div className="group p-6 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <Badge className="bg-success text-success-foreground text-xs font-medium">Essential</Badge>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-lg mb-2">Weitwinkel ≤ 28 mm (Äquivalent)</h5>
                                    <p className="text-muted-foreground mb-3">
                                      iPhone 11 Pro oder neuer, Samsung Galaxy S20+ oder vergleichbar
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-success">
                                      <CheckSquare className="w-3 h-3" />
                                      <span>Erfasst ganze Räume</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="group p-6 bg-gradient-to-r from-info/5 to-info/10 rounded-xl border border-info/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <Badge variant="outline" className="text-xs font-medium border-info/30">Optional</Badge>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-lg mb-2">Clip-Weitwinkel-Objektiv</h5>
                                    <p className="text-muted-foreground mb-3">
                                      Für noch mehr Weitwinkel bei älteren Geräten
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-info">
                                      <Lightbulb className="w-3 h-3" />
                                      <span>Erweitert Sichtfeld um ~20%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="kamera" className="mt-8">
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                              <Camera className="w-6 h-6 text-primary" />
                              <h4 className="font-semibold text-xl">Kamera-Setup</h4>
                            </div>
                            <div className="grid gap-6">
                              <div className="group p-6 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <Badge className="bg-orange-500 text-white text-xs font-medium">Crop</Badge>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-lg mb-2">10–22 mm Weitwinkel-Zoom</h5>
                                    <p className="text-muted-foreground mb-3">
                                      Für APS-C Sensoren (Canon, Sony, Fuji)
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-success">
                                      <CheckSquare className="w-3 h-3" />
                                      <span>Optimal für Crop-Format</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="group p-6 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <Badge className="bg-primary text-primary-foreground text-xs font-medium">Vollformat</Badge>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-lg mb-2">16–35 mm Weitwinkel-Zoom</h5>
                                    <p className="text-muted-foreground mb-3">
                                      Für Vollformat-Sensoren
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-success">
                                      <CheckSquare className="w-3 h-3" />
                                      <span>Maximale Bildqualität</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-8 p-6 bg-gradient-to-r from-warning/5 to-warning/10 rounded-xl border border-warning/20">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                            <Layout className="w-4 h-4 text-warning" />
                          </div>
                          <h4 className="font-semibold text-lg">Zusätzliche Ausrüstung</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                            <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                            <span className="font-medium">Stabiles Stativ</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                            <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                            <span className="font-medium">Fernauslöser/Timer</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                            <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                            <span className="font-medium">Ersatzakkus</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                            <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                            <span className="font-medium">Leere SD-Karte</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                            <CheckSquare className="w-5 h-5 text-warning flex-shrink-0" />
                            <span className="font-medium">LED-Panel <span className="text-xs text-muted-foreground">(optional)</span></span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                            <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                            <span className="font-medium">Mikrofasertuch</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Grundeinstellungen */}
                <section id="settings" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center">
                        <Settings className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Grundeinstellungen</h2>
                        <p className="text-muted-foreground">Die optimalen Kamera-Parameter für Immobilienfotos</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <Settings className="w-3 h-3 mr-1" />
                      Technik
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                              <Camera className="w-4 h-4 text-primary" />
                            </div>
                            <h4 className="font-semibold text-xl">Kamera-Parameter</h4>
                          </div>
                          <div className="space-y-4">
                            <div className="group p-5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Aperture className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-lg mb-1">Blende: f/8 – f/11</h5>
                                  <p className="text-sm text-muted-foreground">Optimale Schärfentiefe für Immobilienfotos</p>
                                </div>
                              </div>
                            </div>
                            <div className="group p-5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Settings className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-lg mb-1">ISO: 100–200</h5>
                                  <p className="text-sm text-muted-foreground">Minimales Bildrauschen bei bester Qualität</p>
                                </div>
                              </div>
                            </div>
                            <div className="group p-5 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/20 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileImage className="w-6 h-6 text-success" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-lg mb-1">Format: RAW/DNG</h5>
                                  <p className="text-sm text-muted-foreground">Maximale Bearbeitungsqualität</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                              <Zap className="w-4 h-4 text-accent" />
                            </div>
                            <h4 className="font-semibold text-xl">Zusatzfunktionen</h4>
                          </div>
                          <div className="space-y-4">
                            <div className="group p-5 bg-gradient-to-r from-info/5 to-info/10 rounded-xl border border-info/20 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Sun className="w-6 h-6 text-info" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-lg mb-1">Weißabgleich: ≈ 5.500 K</h5>
                                  <p className="text-sm text-muted-foreground">Tageslicht sperren für konsistente Farben</p>
                                </div>
                              </div>
                            </div>
                            <div className="group p-5 bg-gradient-to-r from-info/5 to-info/10 rounded-xl border border-info/20 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Grid3X3 className="w-6 h-6 text-info" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-lg mb-1">Gitternetz aktivieren</h5>
                                  <p className="text-sm text-muted-foreground">Drittel-Regel & perfekte Ausrichtung</p>
                                </div>
                              </div>
                            </div>
                            <div className="group p-5 bg-gradient-to-r from-warning/5 to-warning/10 rounded-xl border border-warning/20 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Camera className="w-6 h-6 text-warning" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-lg mb-1">3er-Bracketing (Innen)</h5>
                                  <p className="text-sm text-muted-foreground">HDR-Pro-Modus für Smartphones</p>
                                </div>
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
                <section id="lighting" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl flex items-center justify-center">
                        <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Licht & Belichtung</h2>
                        <p className="text-muted-foreground">Die Kunst der perfekten Belichtung meistern</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Kreativ
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        <div className="p-8 bg-gradient-to-br from-warning/10 via-success/5 to-success/10 rounded-2xl border border-warning/20">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                              <Star className="w-5 h-5 text-warning" />
                            </div>
                            <h4 className="font-semibold text-xl">Goldene Regeln</h4>
                          </div>
                          <div className="grid gap-4">
                            <div className="flex items-start gap-4 p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-primary">1</span>
                              </div>
                              <div>
                                <h5 className="font-semibold mb-1">Alle Lampen einschalten + Vorhänge öffnen</h5>
                                <p className="text-sm text-muted-foreground">Maximale Ausleuchtung für natürliche Atmosphäre</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-primary">2</span>
                              </div>
                              <div>
                                <h5 className="font-semibold mb-1">Fenster-Bracketing ±2 EV verwenden</h5>
                                <p className="text-sm text-muted-foreground">Perfekte Balance zwischen Innen- und Außenbereich</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-primary">3</span>
                              </div>
                              <div>
                                <h5 className="font-semibold mb-1">Blaue-Stunde-Trick für Außenaufnahmen</h5>
                                <p className="text-sm text-muted-foreground">Dramatische Stimmung für Außenansichten</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Komposition */}
                <section id="composition" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl flex items-center justify-center">
                        <Layout className="w-8 h-8 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Komposition & Bildaufbau</h2>
                        <p className="text-muted-foreground">Perfekte Perspektiven und ansprechende Bildaufteilung</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <Layout className="w-3 h-3 mr-1" />
                      Kreativ
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                                <Grid3X3 className="w-4 h-4 text-accent" />
                              </div>
                              <h4 className="font-semibold text-xl">Bildaufteilung</h4>
                            </div>
                            <div className="space-y-4">
                              <div className="group p-5 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-accent/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Grid3X3 className="w-6 h-6 text-accent" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-lg mb-1">Drittel-Regel nutzen</h5>
                                    <p className="text-sm text-muted-foreground">Wichtige Elemente auf Schnittpunkten positionieren</p>
                                  </div>
                                </div>
                              </div>
                              <div className="group p-5 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-accent/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Eye className="w-6 h-6 text-accent" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-lg mb-1">Symmetrie & Balance</h5>
                                    <p className="text-sm text-muted-foreground">Ausgewogene Bildkomposition schaffen</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <Camera className="w-4 h-4 text-primary" />
                              </div>
                              <h4 className="font-semibold text-xl">Perspektiven</h4>
                            </div>
                            <div className="space-y-4">
                              <div className="group p-5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-primary">↕</span>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-lg mb-1">Kamera-Höhe: 1,40m</h5>
                                    <p className="text-sm text-muted-foreground">Standard-Blickwinkel für natürliche Raumwirkung</p>
                                  </div>
                                </div>
                              </div>
                              <div className="group p-5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Layout className="w-6 h-6 text-primary" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-lg mb-1">Ecken vermeiden</h5>
                                    <p className="text-sm text-muted-foreground">Zentrale Positionen für optimale Raumerfassung</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Staging */}
                <section id="staging" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-info/10 to-info/20 rounded-2xl flex items-center justify-center">
                        <Palette className="w-8 h-8 text-info" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Staging & Raumvorbereitung</h2>
                        <p className="text-muted-foreground">Räume optimal für die Fotografie vorbereiten</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <Palette className="w-3 h-3 mr-1" />
                      Vorbereitung
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        <div className="p-8 bg-gradient-to-br from-info/10 via-success/5 to-success/10 rounded-2xl border border-info/20">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                              <CheckSquare className="w-5 h-5 text-info" />
                            </div>
                            <h4 className="font-semibold text-xl">Staging-Checkliste</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                              <span className="font-medium">Alle Oberflächen reinigen</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                              <span className="font-medium">Persönliche Gegenstände entfernen</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                              <span className="font-medium">Möbel optimal positionieren</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                              <span className="font-medium">Vorhänge und Jalousien öffnen</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                              <span className="font-medium">Frische Blumen/Pflanzen</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                              <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                              <span className="font-medium">Gleichmäßige Beleuchtung</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Workflow */}
                <section id="workflow" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-success/10 to-success/20 rounded-2xl flex items-center justify-center">
                        <Workflow className="w-8 h-8 text-success" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Workflow & Upload-Prozess</h2>
                        <p className="text-muted-foreground">Effizienter Ablauf von der Aufnahme bis zur Bearbeitung</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <Workflow className="w-3 h-3 mr-1" />
                      Prozess
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        <div className="grid gap-6">
                          {[
                            { step: 1, title: "Raumvorbereitung", desc: "Staging und Beleuchtung optimieren", icon: Palette },
                            { step: 2, title: "Shooting-Reihenfolge", desc: "Systematisch durch alle Räume", icon: Camera },
                            { step: 3, title: "Qualitätskontrolle", desc: "Bilder direkt auf dem Gerät prüfen", icon: Eye },
                            { step: 4, title: "Upload & Übertragung", desc: "Sichere Übertragung zu Renovirt", icon: Upload }
                          ].map((item, index) => (
                            <div key={index} className="group p-6 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/20 hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg font-bold text-success">{item.step}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <item.icon className="w-5 h-5 text-success" />
                                    <h5 className="font-semibold text-lg">{item.title}</h5>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl flex items-center justify-center">
                        <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Häufige Fragen & Troubleshooting</h2>
                        <p className="text-muted-foreground">Schnelle Lösungen für typische Herausforderungen</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Support
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {[{
                        question: "Fenster sind ausgebrannt – was tun?",
                        answer: "HDR-Modus aktivieren oder 3er-Bracketing verwenden. Bei extremen Kontrasten mehrere Belichtungen manuell kombinieren.",
                        icon: Sun
                      }, {
                        question: "LED-Flimmern in Videos/Fotos?",
                        answer: "Verschlusszeit auf 1/50 s einstellen, um Flimmern zu vermeiden.",
                        icon: Camera
                      }, {
                        question: "Bilder sind zu rauschig?",
                        answer: "ISO-Wert senken (100-200) und bei Bedarf Stativ verwenden für längere Belichtungszeiten.",
                        icon: Settings
                      }, {
                        question: "Starke Verzerrung an den Rändern?",
                        answer: "Brennweite ≥ 14 mm (Vollformat) verwenden oder Korrektur in der Nachbearbeitung.",
                        icon: Grid3X3
                      }].map((faq, index) => <Collapsible key={index} className="group">
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl hover:from-muted/50 hover:to-muted/70 transition-all duration-300 group-data-[state=open]:rounded-b-none">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <faq.icon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-semibold text-left text-lg">{faq.question}</span>
                              </div>
                              <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-6 pt-0 bg-background border border-t-0 rounded-b-xl">
                              <div className="pl-14">
                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>)}
                      </div>
                      
                      <div className="mt-10 p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 rounded-2xl border border-primary/10 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <HelpCircle className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-semibold text-xl mb-3">Weitere Fragen?</h4>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Unser Support-Team hilft Ihnen gerne weiter. Kontaktieren Sie uns für persönliche Beratung.
                        </p>
                        <Button onClick={() => navigate('/help')} className="hover-scale">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Kontakt aufnehmen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Upload-Checkliste */}
                <section id="checklist" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-success/10 to-success/20 rounded-2xl flex items-center justify-center">
                        <CheckSquare className="w-8 h-8 text-success" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">Upload-Checkliste</h2>
                        <p className="text-muted-foreground">Stellen Sie sicher, dass alles perfekt ist</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden md:flex">
                      <CheckSquare className="w-3 h-3 mr-1" />
                      Final
                    </Badge>
                  </div>
                  
                  <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/30">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          {["Mindestens 2 Winkel pro Raum fotografiert", "Alle Dateien im RAW/DNG-Format gespeichert", "Alle Dateien erfolgreich hochgeladen"].map((item, index) => <div key={index} className="group flex items-center gap-4 p-5 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/20 hover:shadow-md transition-all duration-300">
                              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckSquare className="w-5 h-5 text-success" />
                              </div>
                              <span className="font-medium">{item}</span>
                            </div>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* CTA Section - Airbnb-style */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/20 border-0 shadow-2xl">
                  <div className="absolute inset-0 opacity-50"></div>
                  <CardContent className="relative p-12">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                        Bereit für professionelle<br />
                        <span className="text-primary">Immobilienfotos?</span>
                      </h3>
                      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Nutzen Sie unseren Guide und lassen Sie Ihre Aufnahmen von unserem Expertenteam 
                        professionell bearbeiten. Für Ergebnisse, die verkaufen.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                        <Button size="lg" onClick={() => navigate('/order-flow')} className="text-lg px-8 py-4 hover-scale shadow-lg hover:shadow-2xl">
                          <Upload className="w-6 h-6 mr-3" />
                          Jetzt Fotos hochladen
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => navigate('/examples')} className="text-lg px-8 py-4 hover-scale">
                          <Eye className="w-6 h-6 mr-3" />
                          Beispiele ansehen
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer - Airbnb-style */}
            <footer className="bg-background/80 backdrop-blur-sm border-t border-border/50 px-6 py-12">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center md:text-left">
                    <h4 className="font-semibold mb-3">Renovirt</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Professionelle Bildbearbeitung für Immobilienmakler. 
                      Von Maklern für Makler entwickelt.
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-3">Support</h4>
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/help')} className="text-muted-foreground hover:text-foreground">
                        Hilfe & Kontakt
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        FAQ
                      </Button>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <h4 className="font-semibold mb-3">Rechtliches</h4>
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Datenschutz
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Impressum
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    © 2024 Renovirt. Alle Rechte vorbehalten.
                  </p>
                </div>
              </div>
            </footer>
          </main>

          {/* Back to Top Button - Airbnb-style */}
          {showBackToTop && <Button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover-scale bg-background/90 backdrop-blur-sm border border-border/50" size="icon">
              <ArrowUp className="w-6 h-6" />
            </Button>}
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default Guidelines;