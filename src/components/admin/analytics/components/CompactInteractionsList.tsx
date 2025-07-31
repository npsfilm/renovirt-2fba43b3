import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { HelpInteractionData } from '../hooks/useHelpAnalytics';

interface CompactInteractionsListProps {
  interactions: HelpInteractionData[];
}

const CompactInteractionsList = ({ interactions }: CompactInteractionsListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getSatisfactionDisplay = (rating: number | null) => {
    if (rating === null) {
      return (
        <div className="flex items-center gap-1">
          <Minus className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">-</span>
        </div>
      );
    }
    
    if (rating <= 2) {
      return (
        <div className="flex items-center gap-1 text-destructive">
          <XCircle className="h-4 w-4" />
          <span>Nein</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span>Ja</span>
      </div>
    );
  };

  const getCustomerName = (interaction: HelpInteractionData) => {
    const { customer_first_name, customer_last_name, customer_company } = interaction;
    const name = [customer_first_name, customer_last_name].filter(Boolean).join(' ').trim();
    return name || customer_company || 'Gast';
  };

  const getCustomerEmail = (interaction: HelpInteractionData) => {
    if (interaction.customer_email) {
      return interaction.customer_email;
    }
    const ipString = typeof interaction.ip_address === 'string' ? interaction.ip_address : 'Unbekannt';
    return `IP: ${ipString.slice(0, 15)}`;
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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kunde</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Frage</TableHead>
              <TableHead>KI-Antwort</TableHead>
              <TableHead>Zufrieden</TableHead>
              <TableHead>Zeit</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prioritizedInteractions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Keine Interaktionen verfügbar
                </TableCell>
              </TableRow>
            ) : (
              prioritizedInteractions.map((interaction) => (
                <TableRow 
                  key={interaction.id}
                  className={
                    interaction.feedback_rating && interaction.feedback_rating <= 2 
                      ? 'bg-red-50 border-red-200' 
                      : interaction.contacted_support 
                        ? 'bg-orange-50 border-orange-200'
                        : ''
                  }
                >
                  <TableCell className="font-medium">
                    {getCustomerName(interaction)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {getCustomerEmail(interaction)}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className={expandedId === interaction.id ? '' : 'line-clamp-2'}>
                      {interaction.question}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className={expandedId === interaction.id ? '' : 'line-clamp-2'}>
                      {interaction.ai_response}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSatisfactionDisplay(interaction.feedback_rating)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(interaction.created_at), { 
                      addSuffix: true, 
                      locale: de 
                    })}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompactInteractionsList;