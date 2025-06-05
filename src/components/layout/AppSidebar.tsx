import { Calendar, Home, Inbox, Search, Settings, ShoppingCart, Sparkles, User, Shield, LogOut, CreditCard, HelpCircle } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom"
import { useAdminRole } from "@/hooks/useAdminRole"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import CreditsWidget from "./CreditsWidget"

// Main navigation items
const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Bestellungen",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "AI Tools",
    url: "/ai-tools",
    icon: Sparkles,
  },
]

// Account & settings items
const accountItems = [
  {
    title: "Profil",
    url: "/profile",
    icon: User,
  },
  {
    title: "Abrechnung",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Einstellungen",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Hilfe",
    url: "/help",
    icon: HelpCircle,
  },
]

export default function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAdminRole()
  const { signOut } = useAuth()

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/d6ac9ba9-7ad2-408b-a2b0-5f31c269dd53.png" 
            alt="Renovirt Logo" 
            className="h-8 w-auto"
          />
        </div>
        <div className="mt-3">
          <CreditsWidget />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActivePath(item.url)}
                  >
                    <button 
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Konto</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActivePath(item.url)}
                  >
                    <button 
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Admin Panel Access - Only show to admins */}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname.startsWith('/management')}
                  >
                    <button 
                      onClick={() => navigate('/management')}
                      className="w-full flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Shield />
                      <span>Admin Panel</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Abmelden
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
