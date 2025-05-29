
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
      color: 'blue'
    },
    {
      id: 'kamera' as const,
      title: 'Kamera',
      description: 'Einzelaufnahmen von professioneller Kamera',
      icon: Camera,
      color: 'purple'
    },
    {
      id: 'bracketing-3' as const,
      title: 'Bracketing (3 Bilder)',
      description: 'HDR-Serie mit 3 verschiedenen Belichtungen',
      icon: Layers,
      color: 'emerald'
    },
    {
      id: 'bracketing-5' as const,
      title: 'Bracketing (5 Bilder)',
      description: 'HDR-Serie mit 5 verschiedenen Belichtungen',
      icon: Layers,
      color: 'orange'
    },
  ];

  const canProceed = selectedType !== undefined;

  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Wählen Sie Ihren Foto-Typ</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung und beste Ergebnisse.
        </p>
      </div>

      <RadioGroup
        value={selectedType}
        onValueChange={onTypeChange}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {photoTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <Label key={type.id} htmlFor={type.id} className="cursor-pointer group">
              <Card className={`
                relative overflow-hidden transition-all duration-300 transform
                ${isSelected 
                  ? `ring-2 ring-${type.color}-500 bg-${type.color}-50 shadow-lg scale-105` 
                  : 'hover:shadow-xl hover:scale-105 hover:bg-gray-50'
                }
                border-2 h-full
              `}>
                <CardContent className="p-8 text-center relative">
                  <div className="absolute top-4 left-4">
                    <RadioGroupItem 
                      value={type.id} 
                      id={type.id} 
                      className={`w-5 h-5 ${isSelected ? `border-${type.color}-500` : ''}`}
                    />
                  </div>
                  
                  <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300
                    ${isSelected 
                      ? `bg-${type.color}-200 shadow-lg` 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                    }
                  `}>
                    <IconComponent className={`
                      w-10 h-10 transition-all duration-300
                      ${isSelected 
                        ? `text-${type.color}-700` 
                        : 'text-gray-600 group-hover:text-gray-700'
                      }
                    `} />
                  </div>
                  
                  <h3 className={`
                    text-xl font-bold mb-3 transition-colors duration-300
                    ${isSelected ? `text-${type.color}-900` : 'text-gray-900'}
                  `}>
                    {type.title}
                  </h3>
                  
                  <p className={`
                    text-sm leading-relaxed transition-colors duration-300
                    ${isSelected ? `text-${type.color}-700` : 'text-gray-600'}
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
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-blue-700" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-blue-900 mb-3">Bracketing-Information</h4>
                <p className="text-blue-800 mb-4 leading-relaxed">
                  {selectedType === 'bracketing-3' 
                    ? 'Ihre hochgeladenen Bilder werden automatisch in 3er-Gruppen für HDR-Verarbeitung gruppiert.'
                    : 'Ihre hochgeladenen Bilder werden automatisch in 5er-Gruppen für HDR-Verarbeitung gruppiert.'
                  }
                </p>
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium">
                    💡 Die Anzahl der Bilder für die Preisberechnung wird basierend auf den resultierenden HDR-Bildern angepasst. 
                    Z.B. 6 Bilder mit 3er-Reihen ergeben 2 finale HDR-Bilder.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-green-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-green-700" />
            </div>
            Pro-Tipp für beste Ergebnisse
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-green-800 mb-6 leading-relaxed">
            Für optimale Bildqualität und professionelle Ergebnisse empfehlen wir, unsere detaillierten Guidelines zu befolgen. 
            Dort finden Sie wertvolle Tipps zur Aufnahmetechnik und Bildoptimierung.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="default" 
              className="text-green-700 border-green-300 hover:bg-green-100 hover:border-green-400 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Guidelines ansehen
            </Button>
            <Button 
              variant="outline" 
              size="default" 
              className="text-green-700 border-green-300 hover:bg-green-100 hover:border-green-400 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Tipps & Tricks
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-6">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          size="lg"
          className="min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Weiter zum Upload →
        </Button>
      </div>
    </div>
  );
};

export default PhotoTypeStep;
