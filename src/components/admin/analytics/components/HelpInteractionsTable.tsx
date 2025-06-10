
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, HelpCircle, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface HelpInteraction {
  id: string;
  question: string;
  ai_response: string;
  user_id: string | null;
  feedback_rating: number | null;
  contacted_support: boolean;
  response_time_ms: number | null;
  created_at: string;
  ip_address: string | null;
}

const HelpInteractionsTable = () => {
  const { data: interactions, isLoading } = useQuery({
    queryKey: ['help-interactions-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as HelpInteraction[];
    }
  });

  const getFeedbackIcon = (rating: number | null, contactedSupport: boolean) => {
    if (contactedSupport) {
      return <XCircle className="w-4 h-4 text-destructive" />;
    }
    if (rating === null) {
      return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
    }
    return rating > 3 ? 
      <CheckCircle className="w-4 h-4 text-success" /> : 
      <XCircle className="w-4 h-4 text-destructive" />;
  };

  const getFeedbackText = (rating: number | null, contactedSupport: boolean) => {
    if (contactedSupport) return 'Support kontaktiert';
    if (rating === null) return 'Keine Bewertung';
    return rating > 3 ? 'Hilfreich' : 'Nicht hilfreich';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lade Hilfe-Interaktionen...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Hilfe-Interaktionen Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum & Zeit</TableHead>
                <TableHead>Frage</TableHead>
                <TableHead>Antwort (Auszug)</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Hilfreich</TableHead>
                <TableHead>Antwortzeit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interactions?.map((interaction) => (
                <TableRow key={interaction.id}>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {new Date(interaction.created_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(interaction.created_at), { 
                        addSuffix: true, 
                        locale: de 
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={interaction.question}>
                      {interaction.question}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <div className="truncate text-sm text-muted-foreground" title={interaction.ai_response}>
                      {interaction.ai_response.substring(0, 100)}
                      {interaction.ai_response.length > 100 && '...'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      {interaction.user_id ? (
                        <Badge variant="secondary">Angemeldet</Badge>
                      ) : (
                        <Badge variant="outline">Gast</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFeedbackIcon(interaction.feedback_rating, interaction.contacted_support)}
                      <span className="text-sm">
                        {getFeedbackText(interaction.feedback_rating, interaction.contacted_support)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {interaction.response_time_ms ? (
                      <Badge variant="outline">
                        {Math.round(interaction.response_time_ms / 1000)}s
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpInteractionsTable;
