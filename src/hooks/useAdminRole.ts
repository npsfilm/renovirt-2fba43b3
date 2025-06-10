
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
      console.log('useAdminRole: Starting check', { user: !!user, authLoading });
      
      if (authLoading) {
        console.log('useAdminRole: Auth still loading');
        return;
      }
      
      if (!user) {
        console.log('useAdminRole: No user, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('useAdminRole: Checking admin role for user:', user.id);
        
        const { data, error } = await supabase
          .from('customer_profiles')
          .select('app_role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('useAdminRole: Error checking admin role:', error);
          secureLog('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          const isUserAdmin = data?.app_role === 'admin';
          console.log('useAdminRole: Role check result:', { 
            app_role: data?.app_role, 
            isAdmin: isUserAdmin 
          });
          setIsAdmin(isUserAdmin);
        }
      } catch (error) {
        console.error('useAdminRole: Exception in checkAdminRole:', error);
        secureLog('Error in checkAdminRole:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, authLoading]);

  console.log('useAdminRole: Current state', { isAdmin, loading, userId: user?.id });

  return { isAdmin, loading };
};
