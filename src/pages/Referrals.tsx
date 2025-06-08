
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Users, Star, Trophy } from 'lucide-react';
import ReferralBox from '@/components/dashboard/ReferralBox';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserCredits } from '@/hooks/useUserCredits';

const Referrals = () => {
  const { user } = useAuth();
  const { credits } = useUserCredits();

  const { data: referralStats } = useQuery({
    queryKey: ['detailed-referral-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { total_referrals: 0, successful_referrals: 0, total_rewards: 0, pending_rewards: 0 };
      
      const { data, error } = await supabase
        .from('referrals')
        .select('reward_amount, reward_claimed, credits_approved_at')
        .eq('referrer_id', user.id);

      if (error) throw error;

      const total_referrals = data?.length || 0;
      const successful_referrals = data?.filter(ref => ref.credits_approved_at).length || 0;
      const total_rewards = data?.reduce((sum, ref) => sum + (ref.credits_approved_at ? ref.reward_amount : 0), 0) || 0;
      const pending_rewards = data?.reduce((sum, ref) => sum + (!ref.credits_approved_at ? ref.reward_amount : 0), 0) || 0;

      return { total_referrals, successful_referrals, total_rewards, pending_rewards };
    },
    enabled: !!user?.id,
  });

  const { data: recentReferrals } = useQuery({
    queryKey: ['recent-referrals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('referrals')
        .select('created_at, reward_amount, credits_approved_at')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Empfehlungsprogramm" 
            subtitle="Empfehlen Sie Renovirt weiter und verdienen Sie kostenlose Bilder"
          />

          <main className="flex-1 space-y-6 p-6">
            {/* Current Credits Display */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{credits || 0}</p>
                    <p className="text-sm text-blue-600">Verfügbare kostenfreie Bilder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Box */}
            <ReferralBox />

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{referralStats?.total_referrals || 0}</p>
                      <p className="text-sm text-gray-600">Gesamt Empfehlungen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{referralStats?.successful_referrals || 0}</p>
                      <p className="text-sm text-gray-600">Erfolgreiche Empfehlungen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{referralStats?.total_rewards || 0}</p>
                      <p className="text-sm text-gray-600">Erhaltene Bilder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{referralStats?.pending_rewards || 0}</p>
                      <p className="text-sm text-gray-600">Ausstehende Belohnungen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-green-600" />
                  So funktioniert's
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Empfehlungscode teilen</h3>
                    <p className="text-sm text-gray-600">
                      Teilen Sie Ihren persönlichen Empfehlungscode mit Freunden und Kollegen
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Freund registriert sich</h3>
                    <p className="text-sm text-gray-600">
                      Ihr Freund registriert sich mit Ihrem Code und kann sofort loslegen
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Sie erhalten Belohnung</h3>
                    <p className="text-sm text-gray-600">
                      Nach der ersten Bestellung erhalten Sie 10 kostenfreie Bilder
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Referrals */}
            <Card>
              <CardHeader>
                <CardTitle>Aktuelle Empfehlungen</CardTitle>
              </CardHeader>
              <CardContent>
                {recentReferrals && recentReferrals.length > 0 ? (
                  <div className="space-y-3">
                    {recentReferrals.map((referral, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">Empfehlung vom {new Date(referral.created_at).toLocaleDateString('de-DE')}</p>
                          <p className="text-xs text-gray-500">{referral.reward_amount} Bilder</p>
                        </div>
                        <Badge 
                          variant={referral.credits_approved_at ? "default" : "secondary"}
                        >
                          {referral.credits_approved_at ? "Gutgeschrieben" : "Ausstehend"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Noch keine Empfehlungen vorhanden</p>
                    <p className="text-sm">Teilen Sie Ihren Code und verdienen Sie kostenfreie Bilder!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Referrals;
