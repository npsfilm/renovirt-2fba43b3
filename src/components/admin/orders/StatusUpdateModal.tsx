
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatusUpdateModalProps {
  orderId: string;
  currentStatus: string;
  isOpen: boolean;
  onClose: () => void;
}

const StatusUpdateModal = ({ orderId, currentStatus, isOpen, onClose }: StatusUpdateModalProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('update_order_status', {
        p_order_id: orderId,
        p_status: status,
        p_message: message || null,
        p_estimated_completion: estimatedCompletion ? new Date(estimatedCompletion).toISOString() : null,
        p_admin_notes: adminNotes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status aktualisiert",
        description: "Der Bestellstatus wurde erfolgreich aktualisiert.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-details'] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setMessage('');
    setEstimatedCompletion('');
    setAdminNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusMutation.mutate();
  };

  const getStatusOptions = () => [
    { value: 'pending', label: 'Ausstehend' },
    { value: 'processing', label: 'In Bearbeitung' },
    { value: 'quality_check', label: 'Qualitätsprüfung' },
    { value: 'completed', label: 'Abgeschlossen' },
    { value: 'delivered', label: 'Ausgeliefert' },
    { value: 'cancelled', label: 'Storniert' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Status aktualisieren</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">Neuer Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status auswählen" />
              </SelectTrigger>
              <SelectContent>
                {getStatusOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
            <Label htmlFor="estimatedCompletion">Geschätzte Fertigstellung (optional)</Label>
            <Input
              id="estimatedCompletion"
              type="datetime-local"
              value={estimatedCompletion}
              onChange={(e) => setEstimatedCompletion(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="adminNotes">Admin-Notizen (intern)</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Interne Notizen..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={updateStatusMutation.isPending}
              className="flex-1"
            >
              {updateStatusMutation.isPending ? 'Wird aktualisiert...' : 'Aktualisieren'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
