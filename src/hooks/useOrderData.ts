
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrderData = () => {
  // Fetch packages
  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('base_price');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch add-ons
  const { data: addOns = [], isLoading: addOnsLoading } = useQuery({
    queryKey: ['add_ons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data;
    },
  });

  return {
    packages,
    addOns,
    packagesLoading,
    addOnsLoading,
  };
};
