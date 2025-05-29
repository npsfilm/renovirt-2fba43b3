
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface TermsAcceptanceProps {
  acceptedTerms: boolean;
  onTermsChange: (accepted: boolean) => void;
}

const TermsAcceptance = ({ acceptedTerms, onTermsChange }: TermsAcceptanceProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={(checked) => onTermsChange(checked as boolean)}
          />
          <p className="text-sm text-gray-600">
            Ich habe die <span className="text-blue-600 underline cursor-pointer">AGB</span> gelesen und akzeptiere die{' '}
            <span className="text-blue-600 underline cursor-pointer">Datenschutzerklärung</span>. Mit Klick auf
            "Kostenpflichtig bestellen" schließe ich einen verbindlichen Vertrag ab.
          </p>
        </div>
        {!acceptedTerms && (
          <p className="text-red-600 text-sm mt-2">Bitte akzeptieren Sie die Bedingungen, um fortzufahren.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TermsAcceptance;
