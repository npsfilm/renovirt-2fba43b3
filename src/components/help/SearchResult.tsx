
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Bot } from 'lucide-react';

interface SearchResultProps {
  query: string;
  result: string;
  onFeedback: (helpful: boolean) => void;
  isHelpful: boolean | null;
}

const SearchResult = ({ query, result, onFeedback, isHelpful }: SearchResultProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5 text-blue-600" />
          AI-Antwort zu Ihrer Frage
        </CardTitle>
        <p className="text-sm text-gray-600 font-medium">
          "{query}"
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-800">
            {result}
          </div>
        </div>
        
        {isHelpful === null && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">War diese Antwort hilfreich?</p>
            <div className="flex gap-3">
              <Button 
                onClick={() => onFeedback(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                Ja, das hat geholfen
              </Button>
              <Button 
                onClick={() => onFeedback(false)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                Nein, ich brauche weitere Hilfe
              </Button>
            </div>
          </div>
        )}

        {isHelpful === true && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Schön, dass wir Ihnen helfen konnten!</span>
            </div>
          </div>
        )}

        {isHelpful === false && (
          <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Etwas noch unklar? Senden Sie unserem Support eine Nachricht.
            </p>
            <p className="text-xs text-blue-700">
              Unser Support-Team kann Ihnen persönlich weiterhelfen.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResult;
