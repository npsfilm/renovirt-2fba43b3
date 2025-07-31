import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Star, Phone, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface InteractionData {
  id: string;
  question: string;
  ai_response: string;
  feedback_rating: number | null;
  contacted_support: boolean;
  created_at: string;
  customer_profiles: any;
  ip_address: unknown;
  user_id: string | null;
  session_id: string;
  user_agent: string | null;
  response_time_ms: number | null;
}

interface CompactInteractionsListProps {
  interactions: InteractionData[];
}

const CompactInteractionsList = ({ interactions }: CompactInteractionsListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusBadge = (rating: number | null, contactedSupport: boolean) => {
    if (contactedSupport) {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
        <Phone className="h-3 w-3 mr-1" />
        Support
      </Badge>;
    }
    
    if (rating === null) {
      return <Badge variant="secondary">Keine Bewertung</Badge>;
    }
    
    if (rating <= 2) {
      return <Badge variant="destructive">
        <Star className="h-3 w-3 mr-1" />
        Unzufrieden
      </Badge>;
    }
    
    if (rating >= 4) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <Star className="h-3 w-3 mr-1" />
        Zufrieden
      </Badge>;
    }
    
    return <Badge variant="secondary">
      <Star className="h-3 w-3 mr-1" />
      Neutral
    </Badge>;
  };

  const getCustomerDisplay = (interaction: InteractionData) => {
    if (interaction.customer_profiles) {
      const { first_name, last_name, company } = interaction.customer_profiles;
      const name = [first_name, last_name].filter(Boolean).join(' ');
      return company ? `${name} (${company})` : name;
    }
    const ipString = typeof interaction.ip_address === 'string' ? interaction.ip_address : 'Unbekannt';
    return `Gast (${ipString.slice(0, 12)})`;
  };

  const prioritizedInteractions = [...interactions]
    .sort((a, b) => {
      // Priorität: 1. Negative Bewertungen, 2. Support-Kontakte, 3. Neueste
      const aScore = (a.feedback_rating && a.feedback_rating <= 2 ? 1000 : 0) + 
                    (a.contacted_support ? 500 : 0) + 
                    new Date(a.created_at).getTime() / 1000000;
      const bScore = (b.feedback_rating && b.feedback_rating <= 2 ? 1000 : 0) + 
                    (b.contacted_support ? 500 : 0) + 
                    new Date(b.created_at).getTime() / 1000000;
      return bScore - aScore;
    })
    .slice(0, 15);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Aktuelle Interaktionen
          <Badge variant="secondary">{prioritizedInteractions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {prioritizedInteractions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Keine Interaktionen verfügbar
          </p>
        ) : (
          prioritizedInteractions.map((interaction) => (
            <div 
              key={interaction.id} 
              className={`border rounded-lg p-3 ${
                interaction.feedback_rating && interaction.feedback_rating <= 2 
                  ? 'border-red-200 bg-red-50' 
                  : interaction.contacted_support 
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">
                      {getCustomerDisplay(interaction)}
                    </span>
                    {getStatusBadge(interaction.feedback_rating, interaction.contacted_support)}
                  </div>
                  
                  <p className="text-sm text-foreground mb-2 line-clamp-2">
                    <strong>Frage:</strong> {interaction.question}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(interaction.created_at), { 
                      addSuffix: true, 
                      locale: de 
                    })}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === interaction.id ? null : interaction.id)}
                >
                  {expandedId === interaction.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {expandedId === interaction.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="space-y-2">
                    <div>
                      <strong className="text-sm">AI-Antwort:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        {interaction.ai_response}
                      </p>
                    </div>
                    
                    {interaction.feedback_rating && (
                      <div className="flex items-center gap-2">
                        <strong className="text-sm">Bewertung:</strong>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < interaction.feedback_rating! 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({interaction.feedback_rating}/5)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CompactInteractionsList;