
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
      const { data, error } = await supabase
        .from('help_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    }
  });
};
