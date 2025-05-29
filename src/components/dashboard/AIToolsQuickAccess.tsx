
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Eraser, 
  Type, 
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

const AIToolsQuickAccess = () => {
  const aiTools = [
    {
      id: 'sky-replacement',
      name: 'Himmel-Austausch',
      description: 'Perfekte Himmel für Ihre Immobilienfotos',
      icon: Image,
      color: 'bg-blue-500',
      isNew: false,
      isPopular: true
    },
    {
      id: 'object-remover',
      name: 'Objekt-Entferner',
      description: 'Störende Elemente automatisch entfernen',
      icon: Eraser,
      color: 'bg-red-500',
      isNew: true,
      isPopular: false
    },
    {
      id: 'text-generator',
      name: 'Text-Generator',
      description: 'KI-gestützte Immobilienbeschreibungen',
      icon: Type,
      color: 'bg-green-500',
      isNew: false,
      isPopular: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
          AI-Tools Schnellzugriff
        </CardTitle>
        <p className="text-sm text-gray-600">
          Professionelle Bearbeitung mit künstlicher Intelligenz
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div key={tool.id} className="group relative">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      {tool.isNew && (
                        <Badge variant="secondary" className="text-xs">
                          Neu
                        </Badge>
                      )}
                      {tool.isPopular && (
                        <Badge className="text-xs bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Beliebt
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Reminder Card for unused tools */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                AI-Tools noch nicht genutzt?
              </h3>
              <p className="text-sm text-gray-600">
                Entdecken Sie unsere KI-Features für professionelle Ergebnisse.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full">
            Alle Tools entdecken
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIToolsQuickAccess;
