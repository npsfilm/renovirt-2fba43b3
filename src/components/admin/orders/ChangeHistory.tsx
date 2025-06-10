
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, User } from 'lucide-react';

interface ChangeHistoryProps {
  orderId: string;
}

const ChangeHistory = ({ orderId }: ChangeHistoryProps) => {
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Änderungshistorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Änderungshistorie ({history?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {history && history.length > 0 ? (
            history.map((entry) => (
              <div key={entry.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      Status: {getStatusLabel(entry.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.created_at).toLocaleString('de-DE')}
                  </div>
                </div>
                {entry.message && (
                  <p className="text-sm text-gray-700 mb-2">{entry.message}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span>Admin</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Noch keine Änderungen vorhanden
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeHistory;
