
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUserCredits = () => {
  const { user } = useAuth();

  const { data: credits, ...query } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { data, error } = await supabase.rpc('get_user_credits', {
        user_uuid: user.id
      });

      if (error) throw error;
      return data || 0;
    },
    enabled: !!user?.id,
  });

  return {
    credits: credits || 0,
    ...query
  };
};
