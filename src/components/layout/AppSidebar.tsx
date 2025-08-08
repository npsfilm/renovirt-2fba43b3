
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNavigationGuard } from '@/contexts/NavigationGuardContext';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, Upload, FileText, CreditCard, User, Settings, HelpCircle, LogOut, MessageSquare } from 'lucide-react';
import CreditsWidget from './CreditsWidget';

const AppSidebar = () => {
  const { navigate } = useNavigationGuard();
  const location = useLocation();
  const { signOut } = useAuth();

  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const menuItems = [
    { title: 'Dashboard', icon: Home, url: '/dashboard' },
    { title: 'Neue Bestellung', icon: Upload, url: '/order' },
    { title: 'Meine Bestellungen', icon: FileText, url: '/orders' },
    { title: 'Rechnungen', icon: CreditCard, url: '/billing' },
    { title: 'Profil', icon: User, url: '/profile' },
    { title: 'Einstellungen', icon: Settings, url: '/settings' },
    { title: 'Hilfe & Support', icon: HelpCircle, url: '/help' }
  ];

  const bottomMenuItems = [
    { title: 'Feature‑Wünsche', icon: MessageSquare, url: '/feedback', description: 'Teilen Sie Ihre Ideen mit uns' }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    // Handle exact matches for specific conflicting paths
    if (path === '/order') {
      return location.pathname === '/order' || location.pathname.startsWith('/order/');
    }
    if (path === '/orders') {
      return location.pathname === '/orders' || location.pathname.startsWith('/orders/');
    }
    // For all other paths, use startsWith logic
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center gap-2'}`}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="focus:outline-none"
            aria-label="Zur Dashboard-Startseite"
            title="Zur Dashboard-Startseite"
          >
            <img 
              src="/lovable-uploads/d6ac9ba9-7ad2-408b-a2b0-5f31c269dd53.png" 
              alt="Renovirt Logo" 
              className={isCollapsed ? 'h-8 w-8 object-contain' : 'h-8 w-auto'} 
            />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Zentraler CTA: Neue Bestellung */}
              <SidebarMenuItem>
                {isCollapsed ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => navigate('/order')}
                          isActive={isActivePath('/order')}
                          aria-current={isActivePath('/order') ? 'page' : undefined}
                          aria-label="Bilder hochladen"
                          className="w-full justify-center mb-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Upload className="w-4 h-4 text-primary-foreground" />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">Bilder hochladen</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <SidebarMenuButton
                    onClick={() => navigate('/order')}
                    isActive={isActivePath('/order')}
                    aria-current={isActivePath('/order') ? 'page' : undefined}
                    className="w-full justify-start mb-4 rounded-lg shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4 text-primary-foreground" />
                    <span className="text-primary-foreground">Bilder hochladen</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>

              {/* Weitere Navigationselemente */}
              {menuItems
                .filter((item) => item.url !== '/order')
                .map((item) => (
                  <SidebarMenuItem key={item.url}>
                    {isCollapsed ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              onClick={() => navigate(item.url)}
                              isActive={isActivePath(item.url)}
                              aria-current={isActivePath(item.url) ? 'page' : undefined}
                              aria-label={item.title}
                              className={`w-full justify-center ${isActivePath(item.url) ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-sidebar-accent'}`}
                            >
                              <item.icon className="w-4 h-4" />
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">{item.title}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        isActive={isActivePath(item.url)}
                        aria-current={isActivePath(item.url) ? 'page' : undefined}
                        className={`w-full justify-start ${isActivePath(item.url) ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-sidebar-accent'}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-4">
          {/* Feature Request Section */}
          <div className="border border-sidebar-border rounded-lg p-3 bg-sidebar-accent/30">
            <div className="text-xs font-medium text-muted-foreground mb-2">Haben Sie eine Idee?</div>
            {bottomMenuItems.map((item) =>
              isCollapsed ? (
                <TooltipProvider key={item.url}>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        isActive={isActivePath(item.url)}
                        aria-current={isActivePath(item.url) ? 'page' : undefined}
                        aria-label={item.title}
                        className={`w-full justify-center text-sm ${
                          isActivePath(item.url) 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'hover:bg-sidebar-accent'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <SidebarMenuButton
                  key={item.url}
                  onClick={() => navigate(item.url)}
                  isActive={isActivePath(item.url)}
                  aria-current={isActivePath(item.url) ? 'page' : undefined}
                  className={`w-full justify-start text-sm ${
                    isActivePath(item.url) 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'hover:bg-sidebar-accent'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </SidebarMenuButton>
              )
            )}
          </div>
          
          {!isCollapsed && <CreditsWidget />}
          
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut} 
                    aria-label="Abmelden"
                    className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Abmelden</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut} 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          )}

        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
