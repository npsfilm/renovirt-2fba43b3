
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

const WelcomeSection = () => {
  const { user } = useAuth();
  
  // Get user's first name from metadata or email
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Nutzer';

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Willkommen zurück, {firstName}! 👋
            </h2>
            <p className="text-gray-600 text-sm">
              Laden Sie hier Ihre neuen Fotos hoch und lassen Sie sie professionell bearbeiten.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Fotos hochladen
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Neue Bestellung
            </Button>
          </div>
        </div>
        
        {/* Empty State Message */}
        <div className="mt-4 text-center py-4 bg-white rounded-lg border border-gray-100">
          <p className="text-gray-500 text-sm">
            Noch keine Bestellung? Testen Sie jetzt Ihre 3 kostenlosen Bilder.
          </p>
          <Button variant="link" size="sm" className="mt-1">
            Mehr erfahren →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
