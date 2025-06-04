
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderNotifications, markNotificationAsRead } from '@/utils/notificationService';
import { useAuth } from './useAuth';
import { useRealtimeNotifications } from './useRealtimeNotifications';

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Enable real-time updates
  useRealtimeNotifications();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getOrderNotifications(user?.id || ''),
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
};
