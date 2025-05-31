
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogging';

export interface OrderNotification {
  id: string;
  order_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  notification_type?: string;
  read: boolean;
  created_at: string;
}

export interface OrderNotificationInput {
  order_id: string;
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  notification_type?: string;
}

export const createOrderNotification = async (notification: OrderNotificationInput) => {
  try {
    const { error } = await supabase
      .from('order_notifications')
      .insert({
        order_id: notification.order_id,
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        notification_type: notification.notification_type || 'order_update',
        read: false
      });

    if (error) throw error;
    
    secureLog('Notification created successfully:', notification);
    return { success: true };
  } catch (error) {
    secureLog('Failed to create notification:', error);
    return { success: false, error };
  }
};

export const getOrderNotifications = async (userId: string): Promise<OrderNotification[]> => {
  try {
    const { data, error } = await supabase
      .from('order_notifications')
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
      .from('order_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    secureLog('Failed to mark notification as read:', error);
    return { success: false, error };
  }
};
