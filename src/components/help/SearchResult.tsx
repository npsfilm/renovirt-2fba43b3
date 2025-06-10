
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="border-0 shadow-sm">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Answer Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Antwort zu: "{query}"
              </p>
              <div className="prose prose-sm max-w-none text-foreground">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              </div>
            </div>
          </div>
          
          {/* Feedback Section */}
          {isHelpful === null && (
            <div className="border-t border-border pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm font-medium text-foreground">
                  War diese Antwort hilfreich?
                </p>
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={() => onFeedback(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-success/10 hover:border-success/30"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Ja, das hat geholfen
                  </Button>
                  <Button 
                    onClick={() => onFeedback(false)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/30"
                  >
                    <XCircle className="w-4 h-4" />
                    Nein, ich brauche weitere Hilfe
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Positive Feedback */}
          {isHelpful === true && (
            <div className="border-t border-border pt-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Schön, dass wir Ihnen helfen konnten!</span>
                </div>
              </div>
            </div>
          )}

          {/* Negative Feedback Hint */}
          {isHelpful === false && (
            <div className="border-t border-border pt-6">
              <div className="text-center bg-primary/5 p-4 rounded-lg">
                <p className="text-sm font-medium text-primary mb-1">
                  Etwas noch unklar?
                </p>
                <p className="text-sm text-muted-foreground">
                  Senden Sie unserem Support eine Nachricht für persönliche Hilfe
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResult;
