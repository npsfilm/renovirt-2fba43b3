import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageCircle,
  Edit3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FeatureRequest } from '@/types/feedback';

interface AdminStats {
  total_requests: number;
  open_requests: number;
  completed_requests: number;
  avg_completion_time: number;
}

const AdminFeedback = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');

  // Fetch feature requests - using mock data for now
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-feature-requests', searchQuery, statusFilter, priorityFilter],
    queryFn: async () => {
      // Mock data for demonstration - replace with actual Supabase query once tables are created
      const mockRequests: FeatureRequest[] = [
        {
          id: '1',
          title: 'Erweiterte Bildreihenbearbeitung',
          description: 'Möglichkeit, mehrere Bilder gleichzeitig zu bearbeiten',
          category_id: '1',
          created_by: 'user1',
          status: 'open',
          priority: 'high',
          upvote_count: 25,
          comment_count: 8,
          admin_response: null,
          estimated_completion: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          feature_categories: {
            id: '1',
            name: 'Bearbeitung',
            color: '#3B82F6',
            created_at: new Date().toISOString()
          },
          customer_profiles: {
            first_name: 'Max',
            last_name: 'Mustermann'
          }
        },
        {
          id: '2',
          title: 'Mobile App',
          description: 'Native mobile App für iOS und Android',
          category_id: '2',
          created_by: 'user2',
          status: 'planned',
          priority: 'medium',
          upvote_count: 42,
          comment_count: 15,
          admin_response: 'In Planung für Q2 2025',
          estimated_completion: '2025-06-30',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          feature_categories: {
            id: '2',
            name: 'Platform',
            color: '#10B981',
            created_at: new Date().toISOString()
          },
          customer_profiles: {
            first_name: 'Anna',
            last_name: 'Schmidt'
          }
        }
      ];

      // Apply filters
      let filteredRequests = mockRequests;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredRequests = filteredRequests.filter(r => 
          r.title.toLowerCase().includes(query) || 
          r.description.toLowerCase().includes(query)
        );
      }

      if (statusFilter !== 'all') {
        filteredRequests = filteredRequests.filter(r => r.status === statusFilter);
      }

      if (priorityFilter !== 'all') {
        filteredRequests = filteredRequests.filter(r => r.priority === priorityFilter);
      }

      return filteredRequests;
    }
  });

  // Fetch admin stats - using mock data for now
  const { data: stats } = useQuery({
    queryKey: ['admin-feedback-stats'],
    queryFn: async () => {
      // Mock stats for demonstration
      return {
        total_requests: 15,
        open_requests: 8,
        completed_requests: 5,
        avg_completion_time: 12
      } as AdminStats;
    }
  });

  // Update feature request mutation - mock implementation for now
  const updateRequestMutation = useMutation({
    mutationFn: async (params: {
      id: string;
      status?: string;
      priority?: string;
      admin_response?: string;
      estimated_completion?: string;
    }) => {
      // Mock update - replace with actual Supabase update once tables are created
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updating feature request:', params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feature-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-feedback-stats'] });
      toast({
        title: 'Erfolgreich aktualisiert',
        description: 'Die Feature-Anfrage wurde erfolgreich aktualisiert.'
      });
      setSelectedRequest(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Fehler',
        description: 'Die Feature-Anfrage konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  });

  const resetForm = () => {
    setAdminResponse('');
    setNewStatus('');
    setNewPriority('');
    setEstimatedCompletion('');
  };

  const handleUpdateRequest = () => {
    if (!selectedRequest) return;

    updateRequestMutation.mutate({
      id: selectedRequest.id,
      status: newStatus || selectedRequest.status,
      priority: newPriority || selectedRequest.priority,
      admin_response: adminResponse || selectedRequest.admin_response,
      estimated_completion: estimatedCompletion || selectedRequest.estimated_completion
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'open': { variant: 'outline' as const, icon: MessageCircle, color: 'text-blue-600' },
      'under_review': { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      'planned': { variant: 'default' as const, icon: AlertCircle, color: 'text-orange-600' },
      'in_progress': { variant: 'default' as const, icon: Edit3, color: 'text-purple-600' },
      'completed': { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      'rejected': { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    };

    const config = variants[status as keyof typeof variants] || variants.open;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'low': 'outline' as const,
      'medium': 'secondary' as const,
      'high': 'default' as const,
      'critical': 'destructive' as const
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priority}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature-Request Management</h1>
          <p className="text-gray-600">Verwalten Sie Kundenfeedback und Feature-Anfragen</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt-Anfragen</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_requests || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offene Anfragen</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.open_requests || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completed_requests || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durchschn. Bearbeitung</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avg_completion_time || 0}d</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Suche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Suche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Nach Titel oder Beschreibung suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="min-w-[150px]">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="open">Offen</SelectItem>
                    <SelectItem value="under_review">In Prüfung</SelectItem>
                    <SelectItem value="planned">Geplant</SelectItem>
                    <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                    <SelectItem value="rejected">Abgelehnt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[150px]">
                <Label htmlFor="priority-filter">Priorität</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger id="priority-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Prioritäten</SelectItem>
                    <SelectItem value="low">Niedrig</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="high">Hoch</SelectItem>
                    <SelectItem value="critical">Kritisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feature-Anfragen</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priorität</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Kommentare</TableHead>
                  <TableHead>Ersteller</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Lädt...</TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Keine Feature-Anfragen gefunden</TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={request.title}>
                          {request.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          style={{ 
                            borderColor: request.feature_categories.color,
                            color: request.feature_categories.color 
                          }}
                        >
                          {request.feature_categories.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          {request.upvote_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                          {request.comment_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.customer_profiles?.first_name} {request.customer_profiles?.last_name}
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.created_at), 'dd.MM.yyyy', { locale: de })}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminResponse(request.admin_response || '');
                                setNewStatus(request.status);
                                setNewPriority(request.priority);
                                setEstimatedCompletion(request.estimated_completion || '');
                              }}
                            >
                              Bearbeiten
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Feature-Anfrage bearbeiten</DialogTitle>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-6">
                                <div>
                                  <h3 className="font-semibold text-lg">{selectedRequest.title}</h3>
                                  <p className="text-gray-600 mt-2">{selectedRequest.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="new-status">Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger id="new-status">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="open">Offen</SelectItem>
                                        <SelectItem value="under_review">In Prüfung</SelectItem>
                                        <SelectItem value="planned">Geplant</SelectItem>
                                        <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                                        <SelectItem value="completed">Abgeschlossen</SelectItem>
                                        <SelectItem value="rejected">Abgelehnt</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="new-priority">Priorität</Label>
                                    <Select value={newPriority} onValueChange={setNewPriority}>
                                      <SelectTrigger id="new-priority">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Niedrig</SelectItem>
                                        <SelectItem value="medium">Mittel</SelectItem>
                                        <SelectItem value="high">Hoch</SelectItem>
                                        <SelectItem value="critical">Kritisch</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="estimated-completion">Geschätzte Fertigstellung</Label>
                                  <Input
                                    id="estimated-completion"
                                    type="date"
                                    value={estimatedCompletion}
                                    onChange={(e) => setEstimatedCompletion(e.target.value)}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="admin-response">Admin-Antwort</Label>
                                  <Textarea
                                    id="admin-response"
                                    placeholder="Antwort oder Kommentar hinzufügen..."
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    rows={4}
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                                    Abbrechen
                                  </Button>
                                  <Button 
                                    onClick={handleUpdateRequest}
                                    disabled={updateRequestMutation.isPending}
                                  >
                                    {updateRequestMutation.isPending ? 'Speichert...' : 'Speichern'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;