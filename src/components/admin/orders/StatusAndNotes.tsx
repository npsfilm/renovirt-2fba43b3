
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatusAndNotesProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onStatusUpdate: () => void;
  isUpdating: boolean;
  orderId: string;
}

const StatusAndNotes = ({
  selectedStatus,
  setSelectedStatus,
  notes,
  setNotes,
  onStatusUpdate,
  isUpdating,
  orderId
}: StatusAndNotesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveNotesMutation = useMutation({
    mutationFn: async (adminNotes: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ admin_notes: adminNotes })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Notizen gespeichert",
        description: "Die Admin-Notizen wurden erfolgreich gespeichert.",
      });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
    },
    onError: (error: any) => {
      console.error('Notes save error:', error);
      toast({
        title: "Fehler",
        description: "Die Notizen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  const handleSaveNotes = () => {
    saveNotesMutation.mutate(notes);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Status & Notizen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status" className="text-sm font-medium">Status ändern</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="mt-1 h-9">
              <SelectValue placeholder="Status auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Warteschlange</SelectItem>
              <SelectItem value="processing">In Bearbeitung</SelectItem>
              <SelectItem value="quality_check">Überprüfung</SelectItem>
              <SelectItem value="revision">In Revision</SelectItem>
              <SelectItem value="completed">Abgeschlossen</SelectItem>
              <SelectItem value="delivered">Abgeschlossen & bezahlt</SelectItem>
              <SelectItem value="cancelled">Storniert</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={onStatusUpdate}
            disabled={isUpdating}
            className="w-full mt-2 h-8"
            size="sm"
          >
            <Save className="w-3 h-3 mr-2" />
            {isUpdating ? 'Wird aktualisiert...' : 'Status speichern'}
          </Button>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium">Admin-Notizen</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interne Notizen hinzufügen..."
            rows={3}
            className="mt-1 text-sm"
          />
          <Button
            onClick={handleSaveNotes}
            disabled={saveNotesMutation.isPending}
            className="w-full mt-2 h-8"
            size="sm"
            variant="outline"
          >
            <FileText className="w-3 h-3 mr-2" />
            {saveNotesMutation.isPending ? 'Wird gespeichert...' : 'Notizen speichern'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusAndNotes;
