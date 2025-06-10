
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Image, Settings, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Guidelines = () => {
  const navigate = useNavigate();

  const photographyTips = [
    {
      title: "Optimale Beleuchtung",
      description: "Verwenden Sie natürliches Licht oder professionelle Beleuchtung für beste Ergebnisse.",
      icon: Lightbulb,
      type: "success" as const
    },
    {
      title: "Hohe Auflösung",
      description: "Mindestens 2000x2000 Pixel für professionelle Bearbeitung.",
      icon: Image,
      type: "success" as const
    },
    {
      title: "Stabile Kameraführung",
      description: "Nutzen Sie ein Stativ oder sorgen Sie für ruhige Hände.",
      icon: Camera,
      type: "success" as const
    },
    {
      title: "Richtige Kameraeinstellungen",
      description: "RAW-Format wenn möglich, niedrige ISO-Werte bevorzugen.",
      icon: Settings,
      type: "success" as const
    }
  ];

  const commonMistakes = [
    {
      title: "Überbelichtung vermeiden",
      description: "Zu helle Bereiche können nicht korrigiert werden.",
      icon: AlertTriangle,
      type: "warning" as const
    },
    {
      title: "Unschärfe vermeiden",
      description: "Bewegungsunschärfe kann nachträglich nicht entfernt werden.",
      icon: AlertTriangle,
      type: "warning" as const
    },
    {
      title: "Komprimierung beachten",
      description: "Vermeiden Sie stark komprimierte JPEG-Dateien.",
      icon: AlertTriangle,
      type: "warning" as const
    }
  ];

  const fileRequirements = [
    "Unterstützte Formate: JPEG, PNG, TIFF, RAW",
    "Maximale Dateigröße: 50 MB pro Datei",
    "Empfohlene Auflösung: Mindestens 2000x2000 Pixel",
    "Farbprofil: sRGB oder Adobe RGB"
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Foto-Guidelines" 
            subtitle="Tipps und Richtlinien für optimale Ergebnisse"
          />
          <main className="flex-1 p-6 py-[24px]">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Zurück Button */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Zurück
                </Button>
              </div>

              {/* Einführung */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Camera className="w-6 h-6 text-primary" />
                    Willkommen zu unseren Foto-Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Befolgen Sie diese Richtlinien, um die bestmöglichen Ergebnisse bei der Bildbearbeitung zu erzielen. 
                    Qualitativ hochwertige Ausgangsbilder sind der Schlüssel zu professionellen Endergebnissen.
                  </p>
                </CardContent>
              </Card>

              {/* Fotografie-Tipps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-success" />
                    Beste Praktiken für die Fotografie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {photographyTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-success/5 rounded-lg border border-success/20">
                        <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <tip.icon className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Häufige Fehler */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                    Häufige Fehler vermeiden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commonMistakes.map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-warning/5 rounded-lg border border-warning/20">
                        <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <mistake.icon className="w-4 h-4 text-warning" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{mistake.title}</h3>
                          <p className="text-sm text-muted-foreground">{mistake.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Datei-Anforderungen */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Image className="w-6 h-6 text-primary" />
                    Technische Anforderungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fileRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Photo-Type spezifische Tipps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Immobilien-Fotografie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Tipp</Badge>
                      <span className="text-sm text-muted-foreground">Weitwinkelobjektiv für Raumaufnahmen</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Tipp</Badge>
                      <span className="text-sm text-muted-foreground">HDR-Technik für ausgewogene Belichtung</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Tipp</Badge>
                      <span className="text-sm text-muted-foreground">Horizontale Ausrichtung beachten</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produkt-Fotografie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Tipp</Badge>
                      <span className="text-sm text-muted-foreground">Neutraler oder weißer Hintergrund</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Tipp</Badge>
                      <span className="text-sm text-muted-foreground">Gleichmäßige Ausleuchtung</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">Tipp</Badge>
                      <span className="text-sm text-muted-foreground">Scharfe Details und Texturen</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Bereit für Ihre Bestellung?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Befolgen Sie diese Guidelines und starten Sie Ihre neue Bestellung für optimale Ergebnisse.
                    </p>
                    <Button 
                      onClick={() => navigate('/order')}
                      className="shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Neue Bestellung starten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Guidelines;
