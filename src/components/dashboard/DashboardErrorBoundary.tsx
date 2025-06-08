
import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const DashboardErrorFallback = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Dashboard-Fehler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Beim Laden des Dashboards ist ein Fehler aufgetreten. 
            Dies kann an einer temporären Verbindungsstörung liegen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              Seite neu laden
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardErrorFallback;
