
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Orders table changed - invalidating queries', payload);
          // Invalidate all order-related queries when orders change
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['order-details'] });
          queryClient.invalidateQueries({ queryKey: ['order-analytics'] });
          queryClient.invalidateQueries({ queryKey: ['quick-insights'] }); // Wichtig für Tagesumsatz
          queryClient.invalidateQueries({ queryKey: ['priority-orders'] });
          queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
          
          // Force refetch für sofortige Updates
          queryClient.refetchQueries({ queryKey: ['quick-insights'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_notifications'
        },
        () => {
          // Invalidate notification queries
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_profiles'
        },
        () => {
          // Invalidate customer queries
          queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
