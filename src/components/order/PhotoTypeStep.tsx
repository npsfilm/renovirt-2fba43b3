
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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wählen Sie Ihren Foto-Typ</h1>
        <p className="text-gray-600">Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung.</p>
      </div>

      <RadioGroup
        value={selectedType}
        onValueChange={onTypeChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {photoTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <Label key={type.id} htmlFor={type.id} className="cursor-pointer">
              <Card className={`transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-between mb-4">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-200' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      {selectedType?.startsWith('bracketing') && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Layers className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">Bracketing-Information</h4>
                <p className="text-sm text-blue-700 mb-3">
                  {selectedType === 'bracketing-3' 
                    ? 'Ihre hochgeladenen Bilder werden automatisch in 3er-Gruppen für HDR-Verarbeitung gruppiert.'
                    : 'Ihre hochgeladenen Bilder werden automatisch in 5er-Gruppen für HDR-Verarbeitung gruppiert.'
                  }
                </p>
                <p className="text-xs text-blue-600">
                  Die Anzahl der Bilder für die Preisberechnung wird basierend auf den resultierenden HDR-Bildern angepasst. 
                  Z.B. 6 Bilder mit 3er-Reihen ergeben 2 finale HDR-Bilder.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-900 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Pro-Tipp
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-green-700 mb-4">
            Für beste Ergebnisse empfehlen wir, unsere Guidelines zu befolgen. 
            Dort finden Sie detaillierte Tipps zur optimalen Bildqualität.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-100">
              <ExternalLink className="w-4 h-4 mr-2" />
              Guidelines ansehen
            </Button>
            <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-100">
              <ExternalLink className="w-4 h-4 mr-2" />
              Tipps & Tricks
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[150px]"
        >
          Weiter zum Upload →
        </Button>
      </div>
    </div>
  );
};

export default PhotoTypeStep;
