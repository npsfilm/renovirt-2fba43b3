
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useReferralCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const approveReferralCredits = async (orderId: string, userId: string) => {
    try {
      const { data, error } = await supabase.rpc('approve_referral_credits', {
        order_id_param: orderId,
        user_id_param: userId
      });

      if (error) throw error;

      const result = data as { 
        success?: boolean; 
        message?: string; 
        referrer_id?: string; 
        credits_granted?: number 
      };

      if (result?.success && result.credits_granted && result.credits_granted > 0) {
        console.log(`Referral credits approved: ${result.credits_granted} credits granted to referrer ${result.referrer_id}`);
      }
    } catch (error) {
      console.error('Failed to approve referral credits:', error);
    }
  };

  return {
    approveReferralCredits
  };
};
