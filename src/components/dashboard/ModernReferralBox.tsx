
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Share2, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReferralShareModal from './ReferralShareModal';

const ModernReferralBox = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data: referralCode, isLoading } = useQuery({
    queryKey: ['referral-code', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data?.code || null;
    },
    enabled: !!user?.id,
  });

  const { data: referralStats } = useQuery({
    queryKey: ['referral-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { successful_referrals: 0, total_rewards: 0 };
      
      const { data, error } = await supabase
        .from('referrals')
        .select('reward_amount, reward_claimed')
        .eq('referrer_id', user.id);

      if (error) throw error;

      const successful_referrals = data?.length || 0;
      const total_rewards = data?.reduce((sum, ref) => sum + ref.reward_amount, 0) || 0;

      return { successful_referrals, total_rewards };
    },
    enabled: !!user?.id,
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

  const shareReferralCode = () => {
    setIsShareModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-muted rounded-xl"></div>
              <div>
                <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>
            </div>
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-40"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Freunde einladen</h3>
                <p className="text-sm text-subtle">10 kostenfreie Bilder pro Empfehlung</p>
              </div>
            </div>
            {referralStats && referralStats.successful_referrals > 0 && (
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{referralStats.successful_referrals}</div>
                  <div className="text-xs text-subtle">Empfehlungen</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{referralStats.total_rewards}</div>
                  <div className="text-xs text-subtle">Bilder erhalten</div>
                </div>
              </div>
            )}
          </div>

          {referralCode ? (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Input 
                    value={referralCode} 
                    readOnly 
                    className="font-mono text-center bg-background border-border text-foreground" 
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(referralCode)}
                    className="flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={shareReferralCode}
                    className="flex-shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-subtle">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Ihr persönlicher Empfehlungscode</span>
                </div>
                <Button variant="link" size="sm" className="text-primary p-0">
                  Mehr Details
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-subtle mb-4">
                Laden Sie Ihre Referral-Code Daten...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ReferralShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        referralCode={referralCode || ''}
      />
    </>
  );
};

export default ModernReferralBox;
