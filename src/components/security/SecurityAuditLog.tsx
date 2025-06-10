
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const SecurityAuditLog = () => {
  const { data: securityEvents, isLoading } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as SecurityEvent[];
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'admin_login': return <Shield className="w-4 h-4" />;
      case 'failed_login': return <AlertTriangle className="w-4 h-4" />;
      case 'data_access': return <Eye className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sicherheits-Audit-Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Sicherheits-Audit-Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {securityEvents?.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getEventIcon(event.event_type)}
                <div>
                  <p className="font-medium">{event.event_type}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.created_at), 'dd.MM.yyyy HH:mm')}
                  </p>
                  {event.ip_address && (
                    <p className="text-xs text-gray-500">IP: {event.ip_address}</p>
                  )}
                </div>
              </div>
              <Badge className={getSeverityColor(event.severity)}>
                {event.severity}
              </Badge>
            </div>
          )) || (
            <p className="text-center text-gray-500 py-8">
              Keine Sicherheitsereignisse vorhanden
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;
