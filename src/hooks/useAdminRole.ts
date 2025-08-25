
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
        
        // Verwende maybeSingle statt single um "not found" errors zu vermeiden
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
          // Kein customer_profile gefunden - prüfe ob es bekannte Admin-E-Mails sind
          console.log('useAdminRole: No customer profile found, checking known admin emails');
          const knownAdminEmails = ['niko@renovirt.de'];
          const isKnownAdmin = knownAdminEmails.includes(user.email || '');
          
          if (isKnownAdmin) {
            console.log('useAdminRole: Known admin email detected, creating admin profile');
            // Erstelle automatisch Admin-Profil für bekannte Admin-E-Mails
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
              console.error('useAdminRole: Error creating admin profile:', insertError);
              setIsAdmin(false);
            } else {
              console.log('useAdminRole: Admin profile created successfully');
              setIsAdmin(true);
            }
          } else {
            console.log('useAdminRole: Unknown email, not admin');
            setIsAdmin(false);
          }
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
