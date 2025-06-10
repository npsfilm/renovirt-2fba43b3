
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Clock, Calendar, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AdminReferral {
  id: string;
  referral_code: string;
  created_at: string;
  first_order_id: string | null;
  admin_approved: boolean;
  admin_approved_at: string | null;
  admin_approved_by: string | null;
  admin_notes: string | null;
  reward_amount: number;
  referrer_name: string;
  referrer_user_id: string;
  referred_name: string;
  referred_user_id: string;
  admin_name: string | null;
}

const AdminReferrals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReferral, setSelectedReferral] = useState<AdminReferral | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: referrals, isLoading } = useQuery({
    queryKey: ['admin-referrals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_referrals_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AdminReferral[];
    }
  });

  const approveReferralMutation = useMutation({
    mutationFn: async ({ referralId, notes }: { referralId: string; notes: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('approve_referral_by_admin', {
        referral_id_param: referralId,
        admin_user_id: userData.user.id,
        admin_notes_param: notes || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Empfehlung freigegeben",
        description: "Die Credits wurden erfolgreich dem Werber gutgeschrieben."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-referrals'] });
      setSelectedReferral(null);
      setAdminNotes('');
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "Freigabe fehlgeschlagen",
        variant: "destructive"
      });
    }
  });

  const handleApprove = () => {
    if (!selectedReferral) return;
    approveReferralMutation.mutate({
      referralId: selectedReferral.id,
      notes: adminNotes
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (referral: AdminReferral) => {
    if (referral.admin_approved) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Freigegeben</Badge>;
    }
    if (referral.first_order_id) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Wartend auf Freigabe</Badge>;
    }
    return <Badge variant="outline">Warten auf erste Bestellung</Badge>;
  };

  const pendingApprovals = referrals?.filter(r => r.first_order_id && !r.admin_approved) || [];
  const approvedReferrals = referrals?.filter(r => r.admin_approved) || [];
  const totalReferrals = referrals?.length || 0;

  return (
    <AdminLayout>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Empfehlungs-Verwaltung</h1>
            <p className="text-sm text-gray-500">
              Übersicht und Freigabe von Weiterempfehlungen
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 bg-gray-50 space-y-6">
        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt Empfehlungen</p>
                  <p className="text-2xl font-bold">{totalReferrals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wartend auf Freigabe</p>
                  <p className="text-2xl font-bold">{pendingApprovals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Freigegebene</p>
                  <p className="text-2xl font-bold">{approvedReferrals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empfehlungsliste */}
        <Card>
          <CardHeader>
            <CardTitle>Empfehlungen</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : referrals && referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{referral.referrer_name}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{referral.referred_name}</span>
                        {getStatusBadge(referral)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Registriert: {formatDate(referral.created_at)}</span>
                        </div>
                        
                        {referral.first_order_id && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Erste Bestellung erfolgt</span>
                          </div>
                        )}
                        
                        {referral.admin_approved_at && (
                          <div className="flex items-center gap-1">
                            <span>Freigegeben: {formatDate(referral.admin_approved_at)}</span>
                            {referral.admin_name && <span>von {referral.admin_name}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {referral.reward_amount} Bilder
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Code: {referral.referral_code}
                      </div>
                    </div>

                    {referral.first_order_id && !referral.admin_approved && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setSelectedReferral(referral);
                              setAdminNotes('');
                            }}
                          >
                            Freigeben
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Empfehlung freigeben</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p><strong>Werber:</strong> {referral.referrer_name}</p>
                              <p><strong>Geworbener Kunde:</strong> {referral.referred_name}</p>
                              <p><strong>Belohnung:</strong> {referral.reward_amount} kostenfreie Bilder</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Admin-Notizen (optional)
                              </label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Notizen zur Freigabe..."
                                rows={3}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleApprove}
                                disabled={approveReferralMutation.isPending}
                              >
                                {approveReferralMutation.isPending ? 'Freigeben...' : 'Credits freigeben'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Noch keine Empfehlungen</h3>
                <p className="text-muted-foreground">
                  Empfehlungen werden hier angezeigt, sobald Kunden Weiterempfehlungscodes nutzen.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
};

export default AdminReferrals;
