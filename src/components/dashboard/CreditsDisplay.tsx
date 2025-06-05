
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';

const CreditsDisplay = () => {
  const { credits, isLoading } = useUserCredits();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
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
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-900">{credits} kostenfreie Bilder</p>
            <p className="text-sm text-blue-600">Verfügbares Guthaben</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsDisplay;
