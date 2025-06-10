
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, User, MessageSquare, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChangeHistoryProps {
  orderId: string;
}

const ChangeHistory = ({ orderId }: ChangeHistoryProps) => {
  const [newNote, setNewNote] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ['order-status-history', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_status_history')
        .select(`
          *,
          created_by
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (noteText: string) => {
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      const { error } = await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: currentOrder?.status || 'pending',
          message: noteText,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          is_note: true
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Notiz hinzugefügt",
        description: "Die Notiz wurde erfolgreich gespeichert.",
      });
      setNewNote('');
      queryClient.invalidateQueries({ queryKey: ['order-status-history', orderId] });
    },
    onError: (error: any) => {
      console.error('Note save error:', error);
      toast({
        title: "Fehler",
        description: "Die Notiz konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  const getStatusLabel = (status: string) => {
    const statusMap = {
      pending: 'Warteschlange',
      processing: 'In Bearbeitung',
      quality_check: 'Überprüfung',
      revision: 'In Revision',
      completed: 'Abgeschlossen',
      delivered: 'Abgeschlossen & bezahlt',
      cancelled: 'Storniert'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote.trim());
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Aktivität & Notizen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Aktivität & Notizen ({history?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Chat-ähnliche Historie */}
        <div className="flex-1 space-y-3 max-h-96 overflow-y-auto mb-4 pr-2">
          {history && history.length > 0 ? (
            history.map((entry) => (
              <div key={entry.id} className={`p-3 rounded-lg ${
                entry.is_note 
                  ? 'bg-amber-50 border border-amber-200' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start gap-2">
                  <div className={`p-1 rounded-full ${
                    entry.is_note ? 'bg-amber-200' : 'bg-blue-200'
                  }`}>
                    {entry.is_note ? (
                      <MessageSquare className="w-3 h-3 text-amber-700" />
                    ) : (
                      <Settings className="w-3 h-3 text-blue-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">Admin</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(entry.created_at).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    {!entry.is_note && (
                      <p className="text-xs font-medium text-gray-800 mb-1">
                        Status: {getStatusLabel(entry.status)}
                      </p>
                    )}
                    {entry.message && (
                      <p className="text-sm text-gray-700 break-words">{entry.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Noch keine Aktivität vorhanden
              </p>
            </div>
          )}
        </div>

        {/* Notizen-Eingabe */}
        <div className="border-t pt-4 flex-shrink-0">
          <div className="space-y-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Neue Notiz hinzufügen..."
              rows={3}
              className="text-sm resize-none"
            />
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || addNoteMutation.isPending}
              size="sm"
              className="w-full"
            >
              {addNoteMutation.isPending ? 'Wird gespeichert...' : 'Notiz hinzufügen'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeHistory;
