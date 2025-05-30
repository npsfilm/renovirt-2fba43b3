
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface StatusManagerProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  message: string;
  setMessage: (message: string) => void;
  estimatedCompletion: string;
  setEstimatedCompletion: (date: string) => void;
  onStatusUpdate: () => void;
  isUpdating: boolean;
}

const StatusManager = ({
  selectedStatus,
  setSelectedStatus,
  notes,
  setNotes,
  message,
  setMessage,
  estimatedCompletion,
  setEstimatedCompletion,
  onStatusUpdate,
  isUpdating
}: StatusManagerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status verwalten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status">Status ändern</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Ausstehend</SelectItem>
              <SelectItem value="processing">In Bearbeitung</SelectItem>
              <SelectItem value="quality_check">Qualitätsprüfung</SelectItem>
              <SelectItem value="completed">Abgeschlossen</SelectItem>
              <SelectItem value="delivered">Ausgeliefert</SelectItem>
              <SelectItem value="cancelled">Storniert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message">Nachricht an Kunde (optional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Zusätzliche Informationen für den Kunden..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="estimatedCompletion">Geschätzte Fertigstellung</Label>
          <Input
            id="estimatedCompletion"
            type="datetime-local"
            value={estimatedCompletion}
            onChange={(e) => setEstimatedCompletion(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="notes">Admin-Notizen (intern)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interne Notizen hinzufügen..."
            rows={3}
          />
        </div>

        <Button
          onClick={onStatusUpdate}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? 'Wird aktualisiert...' : 'Status aktualisieren'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatusManager;
