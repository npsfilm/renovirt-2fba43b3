import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Smartphone, Camera, Layers, Info, ExternalLink } from 'lucide-react';

interface PhotoTypeStepProps {
  selectedType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  onTypeChange: (type: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5') => void;
  onNext: () => void;
}

const PhotoTypeStep = ({ selectedType, onTypeChange, onNext }: PhotoTypeStepProps) => {
  const photoTypes = [
    {
      id: 'handy' as const,
      title: 'Handy',
      description: 'Fotos von Smartphone oder Tablet',
      icon: Smartphone,
    },
    {
      id: 'kamera' as const,
      title: 'Kamera',
      description: 'Einzelaufnahmen von professioneller Kamera',
      icon: Camera,
    },
    {
      id: 'bracketing-3' as const,
      title: 'Bracketing (3 Bilder)',
      description: 'HDR-Serie mit 3 verschiedenen Belichtungen',
      icon: Layers,
    },
    {
      id: 'bracketing-5' as const,
      title: 'Bracketing (5 Bilder)',
      description: 'HDR-Serie mit 5 verschiedenen Belichtungen',
      icon: Layers,
    },
  ];

  const canProceed = selectedType !== undefined;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Wählen Sie Ihren Foto-Typ</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung und beste Ergebnisse.
        </p>
      </div>

      <RadioGroup
        value={selectedType}
        onValueChange={onTypeChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {photoTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <Label key={type.id} htmlFor={type.id} className="cursor-pointer group">
              <Card className={`
                relative overflow-hidden transition-all duration-300 ease-out transform
                ${isSelected 
                  ? 'ring-2 ring-primary shadow-lg scale-[1.02] bg-gradient-to-br from-primary/10 to-primary/20'
                  : 'hover:shadow-md hover:scale-[1.01] border-border bg-card'
                }
                border h-full
              `}>
                <CardContent className="p-6 text-center relative">
                  <div className="absolute top-4 right-4">
                    <RadioGroupItem 
                      value={type.id} 
                      id={type.id} 
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isSelected ? 'border-primary text-primary' : 'border-muted-foreground'
                      }`}
                    />
                  </div>
                  
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300
                    ${isSelected 
                      ? 'bg-primary/10 shadow-md' 
                      : 'bg-muted group-hover:bg-muted/80'
                    }
                  `}>
                    <IconComponent className={`
                      w-8 h-8 transition-all duration-300
                      ${isSelected 
                        ? 'text-primary' 
                        : 'text-muted-foreground group-hover:text-foreground'
                      }
                    `} />
                  </div>
                  
                  <h3 className={`
                    text-lg font-semibold mb-2 transition-colors duration-300
                    ${isSelected ? 'text-foreground' : 'text-foreground'}
                  `}>
                    {type.title}
                  </h3>
                  
                  <p className={`
                    text-sm leading-relaxed transition-colors duration-300
                    ${isSelected ? 'text-foreground/80' : 'text-muted-foreground'}
                  `}>
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      {selectedType?.startsWith('bracketing') && (
        <Card className="bg-gradient-to-r from-info/5 to-info/10 border-info/20 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-info" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-foreground mb-2">Bracketing-Information</h4>
                <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
                  {selectedType === 'bracketing-3' 
                    ? 'Ihre hochgeladenen Bilder werden automatisch in 3er-Gruppen für HDR-Verarbeitung gruppiert.'
                    : 'Ihre hochgeladenen Bilder werden automatisch in 5er-Gruppen für HDR-Verarbeitung gruppiert.'
                  }
                </p>
                <div className="bg-info/10 rounded-lg p-3">
                  <p className="text-sm text-info/80 font-medium">
                    💡 Die Anzahl der Bilder für die Preisberechnung wird basierend auf den resultierenden HDR-Bildern angepasst. 
                    Z.B. 6 Bilder mit 3er-Reihen ergeben 2 finale HDR-Bilder.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-success/5 to-success/10 border-success/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-success" />
            </div>
            Pro-Tipp für beste Ergebnisse
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
            Für optimale Bildqualität und professionelle Ergebnisse empfehlen wir, unsere detaillierten Guidelines zu befolgen. 
            Dort finden Sie wertvolle Tipps zur Aufnahmetechnik und Bildoptimierung.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-success border-success/30 hover:bg-success/5 hover:border-success/50 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Guidelines ansehen
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-success border-success/30 hover:bg-success/5 hover:border-success/50 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Tipps & Tricks
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          size="lg"
          className="min-w-[180px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
        >
          Weiter zum Upload →
        </Button>
      </div>
    </div>
  );
};

export default PhotoTypeStep;
