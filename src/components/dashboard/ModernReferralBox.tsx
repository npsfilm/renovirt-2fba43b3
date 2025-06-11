
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Users, Gift, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReferralShareModal from './ReferralShareModal';

const ModernReferralBox = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Fetch user's referral code
  const { data: referralCode, isLoading: codeLoading, error: codeError } = useQuery({
    queryKey: ['user-referral-code', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('ModernReferralBox: No user ID available');
        return null;
      }

      console.log('ModernReferralBox: Fetching referral code for user:', user.id);

      try {
        const { data, error } = await supabase
          .from('referral_codes')
          .select('code')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        console.log('ModernReferralBox: Referral code query result:', { data, error });

        if (error) {
          if (error.code === 'PGRST116') {
            // No referral code found, try to create one
            console.log('ModernReferralBox: No referral code found, creating one...');
            const { data: newCode, error: createError } = await supabase.rpc('create_user_referral_code', {
              user_uuid: user.id
            });

            if (createError) {
              console.error('ModernReferralBox: Error creating referral code:', createError);
              throw createError;
            }

            console.log('ModernReferralBox: Created new referral code:', newCode);
            return newCode;
          }
          console.error('ModernReferralBox: Database error:', error);
          throw error;
        }

        console.log('ModernReferralBox: Found existing referral code:', data.code);
        return data.code;
      } catch (error) {
        console.error('ModernReferralBox: Error in query function:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch referral stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-referral-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { totalReferrals: 0, pendingRewards: 0, earnedRewards: 0 };

      console.log('ModernReferralBox: Fetching referral stats for user:', user.id);

      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('admin_approved, credits_approved_at')
          .eq('referrer_id', user.id);

        if (error) {
          console.error('ModernReferralBox: Stats query error:', error);
          throw error;
        }

        const totalReferrals = data?.length || 0;
        const earnedRewards = data?.filter(r => r.admin_approved && r.credits_approved_at).length || 0;
        const pendingRewards = totalReferrals - earnedRewards;

        const statsResult = { totalReferrals, pendingRewards, earnedRewards };
        console.log('ModernReferralBox: Calculated stats:', statsResult);
        return statsResult;
      } catch (error) {
        console.error('ModernReferralBox: Error fetching stats:', error);
        return { totalReferrals: 0, pendingRewards: 0, earnedRewards: 0 };
      }
    },
    enabled: !!user?.id,
  });

  const handleCopyCode = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: 'Code kopiert!',
        description: 'Ihr Empfehlungscode wurde in die Zwischenablage kopiert.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Fehler',
        description: 'Code konnte nicht kopiert werden.',
        variant: 'destructive',
      });
    }
  };

  console.log('ModernReferralBox: Component state:', { 
    codeLoading, 
    codeError, 
    referralCode, 
    statsLoading, 
    stats, 
    userId: user?.id 
  });

  // Show error state if there's an issue loading the referral code
  if (codeError) {
    console.error('ModernReferralBox: Render error:', codeError);
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Gift className="w-5 h-5" />
            Weiterempfehlung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-red-600 font-medium">Fehler beim Laden des Empfehlungscodes</p>
            <p className="text-sm text-muted-foreground mt-1">
              {codeError.message || 'Unbekannter Fehler'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Gift className="w-5 h-5" />
            Weiterempfehlung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Referral Code Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Ihr Empfehlungscode</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                10 Bilder pro Empfehlung
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background border rounded-lg p-3 font-mono text-lg font-bold text-center">
                {codeLoading ? (
                  <div className="animate-pulse bg-muted h-6 rounded"></div>
                ) : (
                  referralCode || 'Code wird erstellt...'
                )}
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="icon"
                disabled={codeLoading || !referralCode}
                className="h-12 w-12"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {statsLoading ? '...' : stats?.totalReferrals || 0}
              </div>
              <div className="text-sm text-muted-foreground">Empfehlungen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statsLoading ? '...' : stats?.earnedRewards || 0}
              </div>
              <div className="text-sm text-muted-foreground">Erhalten</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statsLoading ? '...' : stats?.pendingRewards || 0}
              </div>
              <div className="text-sm text-muted-foreground">Ausstehend</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setShareModalOpen(true)}
              className="flex-1"
              disabled={codeLoading || !referralCode}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Teilen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/referrals'}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Details
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-sm text-muted-foreground text-center">
            Empfehlen Sie uns weiter und erhalten Sie 10 kostenlose Bilder pro erfolgreichem Neukunden.
          </p>
        </CardContent>
      </Card>

      <ReferralShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        referralCode={referralCode || ''}
      />
    </>
  );
};

export default ModernReferralBox;
