
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Camera, Palette, Home, Building } from 'lucide-react';

const Examples = () => {
  const navigate = useNavigate();

  const examples = [
    {
      category: 'Immobilienvermarktung',
      icon: Building,
      items: [
        {
          title: 'Wohnzimmer - Vorher/Nachher',
          description: 'Professionelle Aufhellung und Farbkorrektur für bessere Verkaufschancen',
          beforeImage: '/placeholder.svg',
          afterImage: '/placeholder.svg'
        },
        {
          title: 'Küche - Virtual Staging',
          description: 'Leere Küche wird mit modernen Möbeln und Accessoires ausgestattet',
          beforeImage: '/placeholder.svg',
          afterImage: '/placeholder.svg'
        },
        {
          title: 'Außenbereich - Himmel-Ersatz',
          description: 'Grauer Himmel wird durch strahlend blauen Himmel ersetzt',
          beforeImage: '/placeholder.svg',
          afterImage: '/placeholder.svg'
        }
      ]
    },
    {
      category: 'Architekturvisualisierung',
      icon: Camera,
      items: [
        {
          title: 'Gebäudefassade - Perspektive-Korrektur',
          description: 'Verzerrungen werden korrigiert für eine professionelle Präsentation',
          beforeImage: '/placeholder.svg',
          afterImage: '/placeholder.svg'
        },
        {
          title: 'Innenarchitektur - Beleuchtung optimiert',
          description: 'Natürliche Beleuchtung wird verstärkt und Schatten reduziert',
          beforeImage: '/placeholder.svg',
          afterImage: '/placeholder.svg'
        }
      ]
    },
    {
      category: 'Fotografie-Enhancement',
      icon: Palette,
      items: [
        {
          title: 'HDR-Bearbeitung',
          description: 'Mehrere Belichtungen zu einem perfekt ausgewogenen Bild kombiniert',
          beforeImage: '/placeholder.svg',
          afterImage: '/placeholder.svg'
        },
        {
          title: 'Objektentfernung',
          description: 'Störende Objekte werden nahtlos aus dem Bild entfernt',
          beforeImage: '/placeholder.svg',
          afterImage: '/placeholder.svg'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/onboarding')}
            className="mr-4 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum Onboarding
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Unsere Beispiele</h1>
            <p className="text-muted-foreground mt-1">Entdecken Sie die Qualität unserer Bildbearbeitung</p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Professionelle Bildbearbeitung für Immobilien</h2>
                <p className="text-muted-foreground">
                  Unsere Experten transformieren Ihre Immobilienfotos in verkaufsstarke Präsentationen. 
                  Von der einfachen Farbkorrektur bis hin zu komplexem Virtual Staging - sehen Sie selbst, 
                  was möglich ist.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples Grid */}
        <div className="space-y-12">
          {examples.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={categoryIndex}>
                <div className="flex items-center mb-6">
                  <CategoryIcon className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((example, itemIndex) => (
                    <Card key={itemIndex} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{example.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{example.description}</p>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-2">
                          <div className="relative">
                            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium z-10">
                              Vorher
                            </div>
                            <img 
                              src={example.beforeImage} 
                              alt="Vorher" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium z-10">
                              Nachher
                            </div>
                            <img 
                              src={example.afterImage} 
                              alt="Nachher" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <Home className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Überzeugt von unserer Qualität?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Starten Sie jetzt mit Ihrem ersten Projekt und erleben Sie selbst, 
              wie wir Ihre Immobilienfotos in verkaufsstarke Präsentationen verwandeln.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/order-flow')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Jetzt Projekt starten
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/onboarding')}
                className="hover:bg-primary/10"
              >
                Zurück zum Onboarding
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Examples;
