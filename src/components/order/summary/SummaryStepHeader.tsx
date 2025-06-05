
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const SummaryStepHeader = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Letzter Check: Ihre Bestellung</h1>
        <p className="text-gray-600">Bitte überprüfen Sie Ihre Auswahl. Mit Klick auf "Kostenpflichtig bestellen" wird die Bestellung verbindlich.</p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">
            Bitte loggen Sie sich ein, um eine Bestellung aufzugeben. 
            <a href="/auth" className="font-medium underline ml-1">Jetzt anmelden</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SummaryStepHeader;
