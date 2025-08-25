
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

      const knownAdminEmails = ['niko@renovirt.de'];
      const isKnownAdmin = knownAdminEmails.includes(user.email || '');

      // Allowlist-Bypass: sofort Admin setzen, um Redirect zu verhindern
      if (isKnownAdmin) {
        console.log('useAdminRole: Known admin email, granting temporary admin access and ensuring profile in background');
        setIsAdmin(true);
        setLoading(false);

        // Stelle das Admin-Profil im Hintergrund sicher (nicht blockierend)
        setTimeout(async () => {
          try {
            const { data: profile, error: fetchError } = await supabase
              .from('customer_profiles')
              .select('id, app_role')
              .eq('user_id', user.id)
              .maybeSingle();

            if (fetchError) {
              console.error('useAdminRole: Error fetching profile (bg):', fetchError);
              secureLog('Error fetching profile (bg):', fetchError);
              return;
            }

            if (!profile) {
              const { error: insertError } = await supabase
                .from('customer_profiles')
                .insert({
                  user_id: user.id,
                  role: 'admin',
                  app_role: 'admin',
                  first_name: 'Admin',
                  last_name: 'User'
                });
              if (insertError) {
                console.error('useAdminRole: Error creating admin profile (bg):', insertError);
                secureLog('Error creating admin profile (bg):', insertError);
              } else {
                console.log('useAdminRole: Admin profile created (bg)');
              }
            } else if (profile.app_role !== 'admin') {
              const { error: updateError } = await supabase
                .from('customer_profiles')
                .update({ app_role: 'admin', role: 'admin' })
                .eq('id', profile.id);
              if (updateError) {
                console.warn('useAdminRole: Could not elevate app_role due to RLS (expected if not admin yet):', updateError);
                secureLog('Could not elevate app_role (bg):', updateError);
              } else {
                console.log('useAdminRole: Elevated app_role to admin (bg)');
              }
            }
          } catch (bgErr) {
            console.error('useAdminRole: Exception in background profile ensure:', bgErr);
            secureLog('Exception in background profile ensure', bgErr as any);
          }
        }, 0);

        return;
      }

      try {
        console.log('useAdminRole: Checking admin role for user:', user.id);
        
        const { data, error } = await supabase
          .from('customer_profiles')
          .select('app_role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('useAdminRole: Error checking admin role:', error);
          secureLog('Error checking admin role:', error);
          setIsAdmin(false);
        } else if (!data) {
          console.log('useAdminRole: No customer profile found; not admin by default');
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
        secureLog('Error in checkAdminRole:', error as any);
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
