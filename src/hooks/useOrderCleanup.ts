
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOrderCleanup = () => {
  useEffect(() => {
    const cleanupAbandonedOrders = async () => {
      try {
        const { error } = await supabase.rpc('cleanup_abandoned_draft_orders');
        if (error) {
          console.error('Failed to cleanup abandoned orders:', error);
        }
      } catch (error) {
        console.error('Error during order cleanup:', error);
      }
    };

    // Clean up on mount
    cleanupAbandonedOrders();

    // Set up periodic cleanup every 30 minutes
    const interval = setInterval(cleanupAbandonedOrders, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
