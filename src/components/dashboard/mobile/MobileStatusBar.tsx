import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Wifi } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MobileStatusBar = () => {
  const { user } = useAuth();
  const { credits } = useUserCredits();

  // Fetch unread notifications count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from('order_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const getInitials = (email: string) => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
      {/* Left: User Avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
            {user?.email ? getInitials(user.email) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3 text-success" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Right: Credits & Notifications */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium">
          {credits} Credits
        </Badge>
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-[8px] text-destructive-foreground font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileStatusBar;