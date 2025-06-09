
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const ReferralHistory = () => {
  const { user } = useAuth();

  const { data: referrals, isLoading } = useQuery({
    queryKey: ['referral-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          customer_profiles!referrals_referred_user_id_fkey(first_name, last_name, company)
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
          <CardTitle>Empfehlungsverlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Empfehlungsverlauf</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {referrals && referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {referral.customer_profiles?.first_name} {referral.customer_profiles?.last_name}
                        {referral.customer_profiles?.company && (
                          <span className="text-muted-foreground"> • {referral.customer_profiles.company}</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Empfohlen am {format(new Date(referral.created_at), 'dd. MMMM yyyy', { locale: de })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">{referral.reward_amount} Bilder</span>
                    <Badge variant={referral.credits_approved_at ? "default" : "secondary"}>
                      {referral.credits_approved_at ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Gutgeschrieben</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Ausstehend</span>
                        </div>
                      )}
                    </Badge>
                  </div>
                </div>
                {referral.credits_approved_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Gutgeschrieben am {format(new Date(referral.credits_approved_at), 'dd. MMMM yyyy', { locale: de })}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Noch keine Empfehlungen</h3>
            <p className="text-muted-foreground">
              Teilen Sie Ihren Empfehlungscode, um Ihre ersten Belohnungen zu erhalten.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralHistory;
