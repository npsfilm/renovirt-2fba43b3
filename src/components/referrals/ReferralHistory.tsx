
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ReferralHistory = () => {
  const { user } = useAuth();

  const { data: referrals, isLoading } = useQuery({
    queryKey: ['referral-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          id,
          referral_code,
          reward_amount,
          reward_claimed,
          created_at,
          credits_approved_at,
          first_order_id
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Empfehlungshistorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (referral: any) => {
    if (referral.credits_approved_at) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Belohnung erhalten</Badge>;
    }
    if (referral.first_order_id) {
      return <Badge variant="secondary">Erste Bestellung erfolgt</Badge>;
    }
    return <Badge variant="outline">Warten auf erste Bestellung</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Empfehlungshistorie
        </CardTitle>
      </CardHeader>
      <CardContent>
        {referrals && referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Code: {referral.referral_code}</span>
                    {getStatusBadge(referral)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Erstellt: {formatDate(referral.created_at)}</span>
                    </div>
                    
                    {referral.credits_approved_at && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Belohnt: {formatDate(referral.credits_approved_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {referral.reward_amount} Bilder
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {referral.credits_approved_at ? 'Gutgeschrieben' : 'Ausstehend'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Noch keine Empfehlungen</h3>
            <p className="text-muted-foreground mb-4">
              Teilen Sie Ihren Empfehlungscode und erhalten Sie kostenlose Bilder für jede erfolgreiche Empfehlung.
            </p>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">So funktioniert es:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Teilen Sie Ihren persönlichen Empfehlungscode</li>
            <li>• Neue Nutzer erhalten 10 kostenlose Bilder bei der Registrierung</li>
            <li>• Nach deren erster Bestellung erhalten Sie 10 kostenlose Bilder</li>
            <li>• Belohnungen werden automatisch gutgeschrieben</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralHistory;
