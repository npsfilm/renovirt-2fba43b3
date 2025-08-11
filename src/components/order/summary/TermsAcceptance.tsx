import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, ExternalLink } from 'lucide-react';
interface TermsAcceptanceProps {
  acceptedTerms: boolean;
  onTermsChange: (accepted: boolean) => void;
}
const TermsAcceptance = React.memo(({
  acceptedTerms,
  onTermsChange
}: TermsAcceptanceProps) => {
  console.log('TermsAcceptance render:', { acceptedTerms });
  
  const handleCheckedChange = useCallback((checked: unknown) => {
    console.log('Checkbox changed:', { checked, acceptedTerms });
    const next = checked === true;
    if (next !== acceptedTerms) {
      console.log('Updating terms to:', next);
      onTermsChange(next);
    }
  }, [acceptedTerms, onTermsChange]);
  return <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
          <Shield className="w-5 h-5" />
          Allgemeine Geschäftsbedingungen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={handleCheckedChange}
            className="mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              Mit der Bestellung akzeptiere ich die{' '}
              <a href="/agb" target="_blank" className="text-primary hover:text-primary/80 underline font-medium inline-flex items-center gap-1">
                Allgemeinen Geschäftsbedingungen
                <ExternalLink className="w-3 h-3" />
              </a>
              {' '}und die{' '}
              <a href="/datenschutz" target="_blank" className="text-primary hover:text-primary/80 underline font-medium inline-flex items-center gap-1">
                Datenschutzerklärung
                <ExternalLink className="w-3 h-3" />
              </a>
              . Durch Klick auf "Jetzt bestellen" schließe ich einen verbindlichen Kaufvertrag ab.
            </p>
            
            {!acceptedTerms && <div className="flex items-center gap-2 mt-3 text-red-600">
                <span className="text-sm font-medium">Bitte akzeptieren Sie die AGBs, um fortzufahren.</span>
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
});

TermsAcceptance.displayName = 'TermsAcceptance';

export default TermsAcceptance;