
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Home,
  BarChart3
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const adminMenuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      url: '/management',
    },
    {
      title: 'Bestellungen',
      icon: ShoppingCart,
      url: '/management/orders',
    },
    {
      title: 'Kunden',
      icon: Users,
      url: '/management/customers',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      url: '/management/analytics',
    },
    {
      title: 'Einstellungen',
      icon: Settings,
      url: '/management/settings',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActivePath = (path: string) => {
    if (path === '/management') {
      return location.pathname === '/management';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Renovirt Admin</h2>
            <p className="text-xs text-gray-500">Management Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={isActivePath(item.url)}
                    className={`w-full justify-start ${
                      isActivePath(item.url)
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'hover:bg-gray-50'
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

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="w-full justify-start"
          >
            <Home className="w-4 h-4 mr-2" />
            Zurück zu App
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
