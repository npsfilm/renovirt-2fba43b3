import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingDown, MessageSquare, User } from 'lucide-react';

interface InteractionData {
  id: string;
  question: string;
  feedback_rating: number | null;
  contacted_support: boolean;
  created_at: string;
  customer_profiles: any;
  ip_address: unknown;
  ai_response: string;
  user_id: string | null;
  session_id: string;
  user_agent: string | null;
  response_time_ms: number | null;
}

interface ActionableSectionProps {
  interactions: InteractionData[];
}

const ActionableSection = ({ interactions }: ActionableSectionProps) => {
  // Negative Bewertungen (1-2 Sterne)
  const negativeInteractions = interactions
    .filter(i => i.feedback_rating && i.feedback_rating <= 2)
    .slice(0, 5);

  // Häufige Probleme - analysiere ähnliche Fragen
  const questionPatterns = interactions.reduce((acc, interaction) => {
    // Einfache Keyword-Analyse für häufige Probleme
    const keywords = interaction.question.toLowerCase().split(' ')
      .filter(word => word.length > 3)
      .filter(word => !['sind', 'haben', 'wird', 'kann', 'dass', 'eine', 'einer', 'einem', 'wird', 'wurde', 'werden'].includes(word));
    
    keywords.forEach(keyword => {
      if (!acc[keyword]) acc[keyword] = [];
      acc[keyword].push(interaction);
    });
    
    return acc;
  }, {} as Record<string, InteractionData[]>);

  const topProblems = Object.entries(questionPatterns)
    .filter(([_, interactions]) => interactions.length >= 2)
    .sort(([_, a], [__, b]) => b.length - a.length)
    .slice(0, 3)
    .map(([keyword, interactions]) => ({
      keyword,
      count: interactions.length,
      avgRating: interactions.reduce((sum, i) => sum + (i.feedback_rating || 0), 0) / interactions.length,
      examples: interactions.slice(0, 2)
    }));

  const getCustomerDisplay = (interaction: InteractionData) => {
    if (interaction.customer_profiles) {
      const { first_name, last_name, company } = interaction.customer_profiles;
      const name = [first_name, last_name].filter(Boolean).join(' ');
      return company ? `${name} (${company})` : name;
    }
    const ipString = typeof interaction.ip_address === 'string' ? interaction.ip_address : 'Unbekannt';
    return `Gast (${ipString.slice(0, 12)})`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Benötigt Aufmerksamkeit */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            Benötigt Aufmerksamkeit
            <Badge variant="destructive">{negativeInteractions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {negativeInteractions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Keine negativen Bewertungen - alles läuft gut! 👍
            </p>
          ) : (
            <div className="space-y-3">
              {negativeInteractions.map((interaction) => (
                <div key={interaction.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        {getCustomerDisplay(interaction)}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {interaction.feedback_rating}/5 ⭐
                    </Badge>
                  </div>
                  <p className="text-sm text-red-700 line-clamp-2">
                    {interaction.question}
                  </p>
                  {interaction.contacted_support && (
                    <Badge variant="outline" className="mt-2 text-xs bg-orange-100 text-orange-700">
                      Hat Support kontaktiert
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Häufige Probleme */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <TrendingDown className="h-5 w-5" />
            Häufige Probleme
            <Badge variant="secondary">{topProblems.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topProblems.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Keine wiederkehrenden Probleme erkannt.
            </p>
          ) : (
            <div className="space-y-3">
              {topProblems.map((problem, index) => (
                <div key={problem.keyword} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800 capitalize">
                        {problem.keyword}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {problem.count}x
                      </Badge>
                      <Badge 
                        variant={problem.avgRating < 3 ? "destructive" : "secondary"} 
                        className="text-xs"
                      >
                        ⌀ {problem.avgRating.toFixed(1)}/5
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-orange-700">
                    <strong>Beispiele:</strong>
                    <ul className="mt-1 space-y-1">
                      {problem.examples.map((example, i) => (
                        <li key={i} className="line-clamp-1">
                          • {example.question}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionableSection;