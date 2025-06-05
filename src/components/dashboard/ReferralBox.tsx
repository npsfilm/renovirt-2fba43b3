import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Share2, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
const ReferralBox = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    data: referralCode
  } = useQuery({
    queryKey: ['referral-code', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.from('referral_codes').select('code').eq('user_id', user.id).eq('is_active', true).maybeSingle();
      if (error) throw error;
      return data?.code || null;
    },
    enabled: !!user?.id
  });
  const {
    data: referralStats
  } = useQuery({
    queryKey: ['referral-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return {
        successful_referrals: 0,
        total_rewards: 0
      };
      const {
        data,
        error
      } = await supabase.from('referrals').select('reward_amount, reward_claimed').eq('referrer_id', user.id);
      if (error) throw error;
      const successful_referrals = data?.length || 0;
      const total_rewards = data?.reduce((sum, ref) => sum + ref.reward_amount, 0) || 0;
      return {
        successful_referrals,
        total_rewards
      };
    },
    enabled: !!user?.id
  });
  const createReferralCode = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const {
        data,
        error
      } = await supabase.rpc('create_user_referral_code', {
        user_uuid: user.id
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['referral-code', user?.id]
      });
      toast({
        title: "Empfehlungscode erstellt",
        description: "Ihr persönlicher Empfehlungscode wurde erfolgreich erstellt."
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Empfehlungscode konnte nicht erstellt werden.",
        variant: "destructive"
      });
    }
  });
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Kopiert!",
        description: "Empfehlungscode wurde in die Zwischenablage kopiert."
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Konnte nicht in die Zwischenablage kopieren.",
        variant: "destructive"
      });
    }
  };
  const shareReferralCode = async () => {
    const shareText = `Schau dir Renovirt an! Mit meinem Code "${referralCode}" kannst du sofort professionelle Bildbearbeitung ausprobieren!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Renovirt Empfehlung',
          text: shareText
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };
  return <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Empfehlen Sie Renovirt weiter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Empfehlen Sie Renovirt weiter und sichern Sie sich 10 kostenfreie Bilder für jede erfolgreiche Empfehlung.
            </p>
            
            {referralCode ? <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input value={referralCode} readOnly className="font-mono text-center bg-white" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(referralCode)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareReferralCode}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {referralStats && referralStats.successful_referrals > 0 && <div className="flex items-center space-x-4 text-sm text-green-700 bg-green-100 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{referralStats.successful_referrals} erfolgreiche Empfehlungen</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gift className="w-4 h-4" />
                      <span>{referralStats.total_rewards} Bilder erhalten</span>
                    </div>
                  </div>}
                
                <p className="text-xs text-gray-500">
                  Teilen Sie diesen Code mit Freunden und Familie
                </p>
              </div> : <Button onClick={() => createReferralCode.mutate()} disabled={createReferralCode.isPending} className="bg-green-600 hover:bg-green-700">
                {createReferralCode.isPending ? 'Erstelle...' : 'Empfehlungscode erstellen'}
              </Button>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ReferralBox;