
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save } from 'lucide-react';

interface StatusAndNotesProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onStatusUpdate: () => void;
  isUpdating: boolean;
}

const StatusAndNotes = ({
  selectedStatus,
  setSelectedStatus,
  notes,
  setNotes,
  onStatusUpdate,
  isUpdating
}: StatusAndNotesProps) => {
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
            <SelectTrigger className="mt-1">
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
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium">Admin-Notizen</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interne Notizen hinzufügen..."
            rows={4}
            className="mt-1"
          />
        </div>

        <Button
          onClick={onStatusUpdate}
          disabled={isUpdating}
          className="w-full"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Wird aktualisiert...' : 'Status speichern'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatusAndNotes;
