
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus, Sparkles, FileText } from 'lucide-react';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Schnellaktionen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" className="w-full justify-start">
          <Upload className="w-4 h-4 mr-2" />
          Fotos hochladen
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Neue Bestellung erstellen
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <Sparkles className="w-4 h-4 mr-2" />
          KI-Tools nutzen
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <FileText className="w-4 h-4 mr-2" />
          Alle Bestellungen anzeigen
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
