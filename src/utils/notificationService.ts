
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogging';

export interface OrderNotification {
  order_id: string;
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const createOrderNotification = async (notification: OrderNotification) => {
  try {
    const { error } = await supabase
      .from('order_notifications')
      .insert({
        order_id: notification.order_id,
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
      });

    if (error) throw error;
    
    secureLog('Notification created successfully');
    return { success: true };
  } catch (error) {
    secureLog('Failed to create notification:', error);
    return { success: false, error };
  }
};

export const getOrderNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('order_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
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
