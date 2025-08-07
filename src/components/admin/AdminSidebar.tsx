
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Bestellungen', 
      href: '/admin/orders', 
      icon: Package 
    },
    { 
      name: 'Kunden', 
      href: '/admin/customers', 
      icon: Users 
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3 
    },
    { 
      name: 'Hilfe Analytics', 
      href: '/admin/help-analytics', 
      icon: HelpCircle 
    },
    { 
      name: 'Feedback', 
      href: '/admin/feedback', 
      icon: MessageSquare 
    },
    { 
      name: 'Einstellungen', 
      href: '/admin/settings', 
      icon: Settings 
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Renovirt</h2>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "w-full text-left",
                      location.pathname === item.href && "bg-gray-100"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Renovirt
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
