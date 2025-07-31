import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Phone, 
  User, 
  Building2, 
  ChevronDown,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface HelpInteraction {
  id: string;
  question: string;
  ai_response: string;
  user_id?: string;
  feedback_rating?: number;
  contacted_support: boolean;
  response_time_ms?: number;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  session_id: string;
  customer_profiles?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    user_id?: string;
  } | null;
}

const EnhancedHelpInteractionsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [supportFilter, setSupportFilter] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: interactions, isLoading } = useQuery({
    queryKey: ['enhanced-help-interactions', searchTerm, ratingFilter, supportFilter],
    queryFn: async () => {
      let query = supabase
        .from('help_interactions')
        .select(`
          *,
          customer_profiles(
            first_name,
            last_name,
            company,
            user_id
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(`question.ilike.%${searchTerm}%,ai_response.ilike.%${searchTerm}%`);
      }

      if (ratingFilter !== 'all') {
        if (ratingFilter === 'positive') {
          query = query.gte('feedback_rating', 4);
        } else if (ratingFilter === 'negative') {
          query = query.lte('feedback_rating', 2);
        } else if (ratingFilter === 'neutral') {
          query = query.eq('feedback_rating', 3);
        }
      }

      if (supportFilter !== 'all') {
        query = query.eq('contacted_support', supportFilter === 'yes');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HelpInteraction[];
    }
  });

  const getCustomerDisplay = (interaction: HelpInteraction) => {
    if (interaction.customer_profiles) {
      const profile = interaction.customer_profiles;
      const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      return {
        type: 'customer',
        display: name || 'Kunde',
        company: profile.company,
        icon: User
      };
    }
    return {
      type: 'guest',
      display: `Gast (${interaction.ip_address?.substring(0, 12)}...)`,
      company: null,
      icon: User
    };
  };

  const getRatingDisplay = (rating?: number, contactedSupport?: boolean) => {
    if (contactedSupport) {
      return {
        icon: Phone,
        text: 'Support kontaktiert',
        color: 'text-orange-600 bg-orange-50',
        variant: 'secondary' as const
      };
    }
    
    if (!rating) {
      return {
        icon: null,
        text: 'Keine Bewertung',
        color: 'text-muted-foreground bg-muted',
        variant: 'outline' as const
      };
    }

    if (rating >= 4) {
      return {
        icon: ThumbsUp,
        text: `${rating} ⭐ Positiv`,
        color: 'text-green-600 bg-green-50',
        variant: 'default' as const
      };
    } else if (rating <= 2) {
      return {
        icon: ThumbsDown,
        text: `${rating} ⭐ Negativ`,
        color: 'text-red-600 bg-red-50',
        variant: 'destructive' as const
      };
    } else {
      return {
        icon: Star,
        text: `${rating} ⭐ Neutral`,
        color: 'text-yellow-600 bg-yellow-50',
        variant: 'secondary' as const
      };
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatResponseTime = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hilfe-Interaktionen laden...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detaillierte Hilfe-Interaktionen</span>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardTitle>
        
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Suchen in Fragen oder Antworten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Bewertung filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Bewertungen</SelectItem>
              <SelectItem value="positive">Positiv (4-5 ⭐)</SelectItem>
              <SelectItem value="neutral">Neutral (3 ⭐)</SelectItem>
              <SelectItem value="negative">Negativ (1-2 ⭐)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={supportFilter} onValueChange={setSupportFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Support-Kontakt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="yes">Support kontaktiert</SelectItem>
              <SelectItem value="no">Kein Support-Kontakt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {interactions && interactions.length > 0 ? (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum / Zeit</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Frage</TableHead>
                  <TableHead>Bewertung</TableHead>
                  <TableHead>Antwortzeit</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interactions.map((interaction) => {
                  const customer = getCustomerDisplay(interaction);
                  const rating = getRatingDisplay(interaction.feedback_rating, interaction.contacted_support);
                  const isExpanded = expandedRows.has(interaction.id);

                  return (
                    <React.Fragment key={interaction.id}>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          {new Date(interaction.created_at).toLocaleString('de-DE')}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <customer.icon className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{customer.display}</span>
                              {customer.company && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {customer.company}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-md">
                          <p className="text-sm line-clamp-2" title={interaction.question}>
                            {interaction.question}
                          </p>
                        </TableCell>

                        <TableCell>
                          <Badge variant={rating.variant} className={rating.color}>
                            {rating.icon && <rating.icon className="w-3 h-3 mr-1" />}
                            {rating.text}
                          </Badge>
                        </TableCell>

                        <TableCell className="font-mono text-xs">
                          {formatResponseTime(interaction.response_time_ms)}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(interaction.id)}
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/30">
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="font-medium text-sm mb-2">Vollständige Frage:</h4>
                                <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                                  {interaction.question}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm mb-2">KI-Antwort:</h4>
                                <div className="text-sm text-muted-foreground bg-background p-3 rounded border max-h-48 overflow-y-auto">
                                  {interaction.ai_response === 'SUPPORT_REQUEST' ? (
                                    <div className="flex items-center gap-2 text-orange-600">
                                      <Phone className="w-4 h-4" />
                                      <span>Weiterleitung an Support erfolgt</span>
                                    </div>
                                  ) : (
                                    <pre className="whitespace-pre-wrap font-sans">
                                      {interaction.ai_response}
                                    </pre>
                                  )}
                                </div>
                              </div>

                              {interaction.ip_address && (
                                <div className="text-xs text-muted-foreground">
                                  IP: {interaction.ip_address} | 
                                  ID: {interaction.id.substring(0, 8)}...
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>

            <div className="text-sm text-muted-foreground text-center pt-4">
              {interactions.length} von insgesamt verfügbaren Interaktionen angezeigt
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Keine Hilfe-Interaktionen gefunden</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedHelpInteractionsTable;