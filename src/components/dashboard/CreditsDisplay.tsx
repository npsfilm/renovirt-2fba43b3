
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';

const CreditsDisplay = () => {
  const { credits, isLoading } = useUserCredits();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-surface-muted to-surface border-border">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="w-20 h-4 bg-muted-background rounded animate-pulse"></div>
              <div className="w-32 h-3 bg-muted-background rounded mt-1 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (credits <= 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-surface-muted to-surface border-border">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-primary">{credits} kostenfreie Bilder</p>
            <p className="text-sm text-muted">Verfügbares Guthaben</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsDisplay;
