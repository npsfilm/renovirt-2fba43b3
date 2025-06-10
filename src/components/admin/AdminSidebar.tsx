import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, FileText, Users, Settings, LogOut, Package, TrendingUp, Plus, UserCheck, HelpCircle } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { title: 'Dashboard', icon: Home, url: '/admin/dashboard' },
    { title: 'Bestellungen', icon: FileText, url: '/admin/orders' },
    { title: 'Kunden', icon: Users, url: '/admin/customers' },
    { title: 'Hilfestatistik', icon: HelpCircle, url: '/admin/help-analytics' },
    { title: 'Analytics', icon: TrendingUp, url: '/admin/analytics' },
    { title: 'Pakete', icon: Package, url: '/admin/packages' },
    { title: 'Add-ons', icon: Plus, url: '/admin/addons' },
    { title: 'Benutzer', icon: UserCheck, url: '/admin/users' },
    { title: 'Einstellungen', icon: Settings, url: '/admin/settings' }
  ];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/d6ac9ba9-7ad2-408b-a2b0-5f31c269dd53.png"
            alt="Renovirt Logo"
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={isActivePath(item.url)}
                    className={`w-full justify-start ${
                      isActivePath(item.url)
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'hover:bg-sidebar-accent'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Abmelden
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
