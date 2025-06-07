
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Plus, Minus } from 'lucide-react';

interface CreditsApplicationProps {
  availableCredits: number;
  maxUsableCredits: number;
  creditsToUse: number;
  onCreditsChange: (credits: number) => void;
}

const CreditsApplication = ({ 
  availableCredits, 
  maxUsableCredits, 
  creditsToUse, 
  onCreditsChange 
}: CreditsApplicationProps) => {
  const [inputValue, setInputValue] = useState(creditsToUse.toString());

  if (availableCredits <= 0) {
    return null;
  }

  // Maximum credits that can be used (limited by available credits and max usable)
  const maxCredits = Math.min(availableCredits, maxUsableCredits);
  const creditValue = creditsToUse * 1; // 1 Euro per credit

  const handleCreditsChange = (newCredits: number) => {
    const validCredits = Math.max(0, Math.min(newCredits, maxCredits));
    setInputValue(validCredits.toString());
    onCreditsChange(validCredits);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseInt(value) || 0;
    handleCreditsChange(numValue);
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Kostenfreie Bilder verwenden
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700">Verfügbar:</span>
          <span className="font-medium text-blue-900">{availableCredits} Credits</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCreditsChange(creditsToUse - 1)}
            disabled={creditsToUse <= 0}
            className="h-8 w-8 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            min="0"
            max={maxCredits}
            className="text-center h-8 bg-white border-blue-300"
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCreditsChange(creditsToUse + 1)}
            disabled={creditsToUse >= maxCredits}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleCreditsChange(0)}
            className="text-blue-600 hover:text-blue-700"
          >
            Keine verwenden
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleCreditsChange(maxCredits)}
            className="text-blue-600 hover:text-blue-700"
          >
            Maximum verwenden
          </Button>
        </div>

        {creditsToUse > 0 && (
          <div className="pt-3 border-t border-blue-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-blue-700">Credits verwendet:</span>
              <span className="font-medium text-blue-900">{creditsToUse}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-blue-700">Ersparnis:</span>
              <span className="font-medium text-green-600">-{creditValue.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditsApplication;
