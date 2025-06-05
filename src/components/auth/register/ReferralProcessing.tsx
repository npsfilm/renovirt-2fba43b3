
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useReferralProcessing = () => {
  const { toast } = useToast();

  const processReferralReward = async (userId: string, referralCode: string, isReferralValid: boolean) => {
    if (!referralCode || !isReferralValid) return;

    try {
      const { data, error } = await supabase.rpc('process_referral', {
        referral_code_param: referralCode,
        new_user_id: userId
      });

      if (error) throw error;

      const result = data as { success?: boolean; message?: string };
      
      if (result?.success) {
        toast({
          title: 'Empfehlung erfolgreich!',
          description: 'Sie sind jetzt registriert. Credits werden nach Ihrer ersten Bestellung gutgeschrieben.',
        });
      }
    } catch (error: any) {
      console.error('Referral processing error:', error);
      // Don't show error to user as registration was successful
    }
  };

  return {
    processReferralReward
  };
};
