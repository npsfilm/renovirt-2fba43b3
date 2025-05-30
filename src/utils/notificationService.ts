
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogging';
import type { OrderNotification } from '@/types/database';

export interface OrderNotificationInput {
  order_id: string;
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const createOrderNotification = async (notification: OrderNotificationInput) => {
  try {
    // Use raw SQL query since the table might not be in generated types yet
    const { error } = await supabase.rpc('create_notification', {
      p_order_id: notification.order_id,
      p_user_id: notification.user_id,
      p_title: notification.title,
      p_message: notification.message,
      p_type: notification.type || 'info'
    });

    if (error) {
      // Fallback to direct table access if RPC doesn't exist
      const { error: insertError } = await supabase
        .from('order_notifications' as any)
        .insert({
          order_id: notification.order_id,
          user_id: notification.user_id,
          title: notification.title,
          message: notification.message,
          type: notification.type || 'info',
        });
      
      if (insertError) throw insertError;
    }
    
    secureLog('Notification created successfully');
    return { success: true };
  } catch (error) {
    secureLog('Failed to create notification:', error);
    return { success: false, error };
  }
};

export const getOrderNotifications = async (userId: string): Promise<OrderNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('order_notifications' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    secureLog('Failed to fetch notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('order_notifications' as any)
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    secureLog('Failed to mark notification as read:', error);
    return { success: false, error };
  }
};
