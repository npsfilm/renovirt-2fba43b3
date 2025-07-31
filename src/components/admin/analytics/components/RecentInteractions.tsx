
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Phone } from 'lucide-react';

interface InteractionData {
  id: string;
  question: string;
  created_at: string;
  feedback_rating?: number;
  contacted_support?: boolean;
  customer_profiles?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    user_id?: string;
  } | null;
}

interface RecentInteractionsProps {
  interactions?: InteractionData[];
}

const RecentInteractions = ({ interactions }: RecentInteractionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Letzte Interaktionen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {interactions?.slice(0, 5).map((interaction) => {
            const customerName = interaction.customer_profiles 
              ? `${interaction.customer_profiles.first_name || ''} ${interaction.customer_profiles.last_name || ''}`.trim()
              : null;
            
            return (
              <div key={interaction.id} className="border-l-4 border-primary/30 pl-3">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium truncate flex-1 mr-2">{interaction.question}</p>
                  {customerName && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {customerName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(interaction.created_at).toLocaleString('de-DE')}
                  </span>
                  {interaction.feedback_rating && interaction.feedback_rating >= 4 && (
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                  )}
                  {interaction.contacted_support && (
                    <Phone className="w-3 h-3 text-orange-600" />
                  )}
                </div>
              </div>
            );
          })}
          {(!interactions || interactions.length === 0) && (
            <p className="text-sm text-gray-500">Keine Interaktionen</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInteractions;
