import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Upload, FileText, CreditCard, User, Settings, HelpCircle, LogOut, Users } from 'lucide-react';
import CreditsWidget from './CreditsWidget';
const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signOut
  } = useAuth();
  const menuItems = [{
    title: 'Dashboard',
    icon: Home,
    url: '/dashboard'
  }, {
    title: 'Neue Bestellung',
    icon: Upload,
    url: '/order'
  }, {
    title: 'Meine Bestellungen',
    icon: FileText,
    url: '/orders'
  }, {
    title: 'Rechnungen',
    icon: CreditCard,
    url: '/billing'
  }, {
    title: 'Profil',
    icon: User,
    url: '/profile'
  }, {
    title: 'Weiterempfehlungen',
    icon: Users,
    url: '/referrals'
  }, {
    title: 'Einstellungen',
    icon: Settings,
    url: '/settings'
  }, {
    title: 'Hilfe & Support',
    icon: HelpCircle,
    url: '/help'
  }];
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };
  return <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/d6ac9ba9-7ad2-408b-a2b0-5f31c269dd53.png" alt="Renovirt Logo" className="h-8 w-auto" />
          <div>
            
            
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton onClick={() => navigate(item.url)} isActive={isActivePath(item.url)} className={`w-full justify-start ${isActivePath(item.url) ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-sidebar-accent'}`}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-4">
          <CreditsWidget />
          
          <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>;
};
export default AppSidebar;