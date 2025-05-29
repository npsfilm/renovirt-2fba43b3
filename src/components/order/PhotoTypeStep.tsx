
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Smartphone, Camera, Layers } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wählen Sie Ihren Foto-Typ</h1>
        <p className="text-gray-600">Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foto-Typ auswählen</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedType}
            onValueChange={onTypeChange}
            className="space-y-4"
          >
            {photoTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div key={type.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                  <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{type.title}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {selectedType?.startsWith('bracketing') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Layers className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Bracketing-Information</h4>
              <p className="text-sm text-blue-700">
                {selectedType === 'bracketing-3' 
                  ? 'Ihre hochgeladenen Bilder werden automatisch in 3er-Gruppen für HDR-Verarbeitung gruppiert.'
                  : 'Ihre hochgeladenen Bilder werden automatisch in 5er-Gruppen für HDR-Verarbeitung gruppiert.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

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
