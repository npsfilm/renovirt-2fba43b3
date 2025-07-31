
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformAnalyticsData } from '../utils/dataTransformers';

export const useHelpAnalytics = () => {
  const { data: rawAnalytics, isLoading } = useQuery({
    queryKey: ['help-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_help_analytics');
      if (error) throw error;
      return data[0];
    }
  });

  const analytics = transformAnalyticsData(rawAnalytics);

  return { analytics, isLoading };
};

export const useRecentHelpInteractions = () => {
  return useQuery({
    queryKey: ['recent-help-interactions'],
    queryFn: async () => {
      // Zuerst die Interaktionen abrufen
      const { data: interactions, error } = await supabase
        .from('help_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Dann die Kundenprofile für vorhandene user_ids abrufen
      const userIds = interactions
        .filter(i => i.user_id)
        .map(i => i.user_id);
      
      let customerProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('customer_profiles')
          .select('user_id, first_name, last_name, company')
          .in('user_id', userIds);
        customerProfiles = profiles || [];
      }
      
      // Daten zusammenführen
      return interactions.map(interaction => ({
        ...interaction,
        customer_profiles: customerProfiles.find(p => p.user_id === interaction.user_id) || null
      }));
    }
  });
};

export const useDetailedHelpInteractions = () => {
  return useQuery({
    queryKey: ['detailed-help-interactions'],
    queryFn: async () => {
      // Zuerst die Interaktionen abrufen
      const { data: interactions, error } = await supabase
        .from('help_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Dann die Kundenprofile für vorhandene user_ids abrufen
      const userIds = interactions
        .filter(i => i.user_id)
        .map(i => i.user_id);
      
      let customerProfiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('customer_profiles')
          .select('user_id, first_name, last_name, company')
          .in('user_id', userIds);
        customerProfiles = profiles || [];
      }
      
      // Daten zusammenführen
      return interactions.map(interaction => ({
        ...interaction,
        customer_profiles: customerProfiles.find(p => p.user_id === interaction.user_id) || null
      }));
    }
  });
};
