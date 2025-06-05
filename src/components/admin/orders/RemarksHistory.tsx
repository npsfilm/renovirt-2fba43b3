
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, User, Clock } from 'lucide-react';

interface RemarksHistoryProps {
  orderId: string;
}

const RemarksHistory = ({ orderId }: RemarksHistoryProps) => {
  const [newRemark, setNewRemark] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: remarks, isLoading } = useQuery({
    queryKey: ['order-remarks', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_remarks')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addRemarkMutation = useMutation({
    mutationFn: async (remark: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('order_remarks')
        .insert({
          order_id: orderId,
          admin_user_id: user.id,
          admin_name: user.email || 'Admin',
          remark: remark.trim(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Bemerkung hinzugefügt",
        description: "Die Bemerkung wurde erfolgreich gespeichert.",
      });
      setNewRemark('');
      queryClient.invalidateQueries({ queryKey: ['order-remarks', orderId] });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Die Bemerkung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!newRemark.trim()) return;
    addRemarkMutation.mutate(newRemark);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Bemerkungen ({remarks?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new remark */}
        <div className="space-y-2">
          <Textarea
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            placeholder="Neue Bemerkung hinzufügen..."
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={!newRemark.trim() || addRemarkMutation.isPending}
            size="sm"
          >
            {addRemarkMutation.isPending ? 'Wird gespeichert...' : 'Bemerkung speichern'}
          </Button>
        </div>

        {/* Remarks history */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : remarks && remarks.length > 0 ? (
            remarks.map((remark) => (
              <div key={remark.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{remark.admin_name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(remark.created_at).toLocaleString('de-DE')}
                  </div>
                </div>
                <p className="text-sm">{remark.remark}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Noch keine Bemerkungen vorhanden
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RemarksHistory;
