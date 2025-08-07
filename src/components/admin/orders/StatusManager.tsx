
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { createOrderNotification } from '@/utils/notificationService';
import { useAdminTracking } from '@/hooks/useAdminTracking';

interface StatusManagerProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onStatusUpdate: () => void;
  isUpdating: boolean;
  orderId?: string;
}

const StatusManager = ({
  selectedStatus,
  setSelectedStatus,
  notes,
  setNotes,
  onStatusUpdate,
  isUpdating,
  orderId
}: StatusManagerProps & { orderId?: string }) => {
  const { trackOrderAction } = useAdminTracking();

  const handleStatusUpdate = async () => {
    // Track admin status change
    if (orderId) {
      trackOrderAction(orderId, 'status_changed', {
        new_status: selectedStatus,
        has_notes: notes.length > 0
      });
    }
    
    // Call the parent's update function
    onStatusUpdate();
  };

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
          <Label htmlFor="notes">Admin-Notizen</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interne Notizen hinzufügen..."
            rows={3}
          />
        </div>

        <Button
          onClick={handleStatusUpdate}
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
