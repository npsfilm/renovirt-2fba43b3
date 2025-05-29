
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogging';

export const useAdminRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (authLoading) return;
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('customer_profiles')
          .select('app_role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          secureLog('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.app_role === 'admin');
        }
      } catch (error) {
        secureLog('Error in checkAdminRole:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, authLoading]);

  return { isAdmin, loading };
};
