
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, ExternalLink } from 'lucide-react';

interface TermsAcceptanceProps {
  acceptedTerms: boolean;
  onTermsChange: (accepted: boolean) => void;
}

const TermsAcceptance = ({ acceptedTerms, onTermsChange }: TermsAcceptanceProps) => {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={(checked) => onTermsChange(checked as boolean)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              Mit der Bestellung akzeptiere ich die{' '}
              <a 
                href="/agb" 
                target="_blank" 
                className="text-primary hover:text-primary/80 underline font-medium inline-flex items-center gap-1"
              >
                Allgemeinen Geschäftsbedingungen
                <ExternalLink className="w-3 h-3" />
              </a>
              {' '}und die{' '}
              <a 
                href="/datenschutz" 
                target="_blank" 
                className="text-primary hover:text-primary/80 underline font-medium inline-flex items-center gap-1"
              >
                Datenschutzerklärung
                <ExternalLink className="w-3 h-3" />
              </a>
              . Durch Klick auf "Jetzt bestellen" schließe ich einen verbindlichen Kaufvertrag ab.
            </p>
            
            {!acceptedTerms && (
              <div className="flex items-center gap-2 mt-3 text-red-600">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Bitte akzeptieren Sie die Bedingungen, um fortzufahren
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsAcceptance;
