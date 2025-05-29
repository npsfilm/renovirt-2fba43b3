
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

const WelcomeSection = () => {
  const { user } = useAuth();
  
  // Get user's first name from metadata or email
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Nutzer';

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">
          Willkommen zurück, {firstName}! 👋
        </CardTitle>
        <p className="text-gray-600">
          Laden Sie hier Ihre neuen Fotos hoch und lassen Sie sie professionell bearbeiten.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="flex-1">
            <Upload className="w-5 h-5 mr-2" />
            Fotos hochladen
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Plus className="w-5 h-5 mr-2" />
            Neue Bestellung starten
          </Button>
        </div>
        
        {/* Empty State Message */}
        <div className="text-center py-6 bg-white rounded-lg border border-gray-100">
          <p className="text-gray-500 text-sm">
            Noch keine Bestellung? Testen Sie jetzt Ihre 3 kostenlosen Bilder.
          </p>
          <Button variant="link" className="mt-2">
            Mehr erfahren →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
