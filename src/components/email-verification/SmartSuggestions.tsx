
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ExternalLink } from 'lucide-react';

interface EmailProviderInfo {
  name: string;
  url: string;
  tips: string[];
}

interface SmartSuggestionsProps {
  suggestions: string[];
  emailProviderInfo: EmailProviderInfo | null;
  email: string;
}

const SmartSuggestions = ({ suggestions, emailProviderInfo, email }: SmartSuggestionsProps) => {
  if (suggestions.length === 0 && !emailProviderInfo) return null;

  return (
    <div className="space-y-3">
      {/* General Suggestions */}
      {suggestions.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Hilfreiche Tipps</span>
            </div>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Email Provider Specific Help */}
      {emailProviderInfo && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  {emailProviderInfo.name} öffnen
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(emailProviderInfo.url, '_blank')}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                Öffnen
              </Button>
            </div>
            {emailProviderInfo.tips.length > 0 && (
              <ul className="space-y-1">
                {emailProviderInfo.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartSuggestions;
