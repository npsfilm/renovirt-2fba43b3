
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudArrowUpIcon, PlusIcon, SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Schnellaktionen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" className="w-full justify-start">
          <CloudArrowUpIcon className="w-4 h-4 mr-2" />
          Fotos hochladen
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <PlusIcon className="w-4 h-4 mr-2" />
          Neue Bestellung erstellen
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <SparklesIcon className="w-4 h-4 mr-2" />
          KI-Tools nutzen
        </Button>
        <Button size="sm" variant="outline" className="w-full justify-start">
          <DocumentTextIcon className="w-4 h-4 mr-2" />
          Alle Bestellungen anzeigen
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
