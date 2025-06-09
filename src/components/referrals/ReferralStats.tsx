
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gift, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ReferralStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['referral-detailed-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('reward_amount, reward_claimed, created_at, credits_approved_at')
        .eq('referrer_id', user.id);

      if (error) throw error;

      const totalReferrals = referrals?.length || 0;
      const totalRewards = referrals?.reduce((sum, ref) => sum + ref.reward_amount, 0) || 0;
      const claimedRewards = referrals?.filter(ref => ref.credits_approved_at).length || 0;
      const pendingRewards = totalReferrals - claimedRewards;

      // Calculate this month's referrals
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthReferrals = referrals?.filter(ref => {
        const refDate = new Date(ref.created_at);
        return refDate.getMonth() === currentMonth && refDate.getFullYear() === currentYear;
      }).length || 0;

      return {
        totalReferrals,
        totalRewards,
        claimedRewards,
        pendingRewards,
        thisMonthReferrals
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-12"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Gesamt Empfehlungen',
      value: stats?.totalReferrals || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Erhaltene Bilder',
      value: stats?.claimedRewards || 0,
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Ausstehende Belohnungen',
      value: stats?.pendingRewards || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Diesen Monat',
      value: stats?.thisMonthReferrals || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReferralStats;
