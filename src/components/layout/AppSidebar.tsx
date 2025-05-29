
import { Calendar, Home, Inbox, Search, Settings, ShoppingCart, Sparkles, User, Shield } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom"
import { useAdminRole } from "@/hooks/useAdminRole"

// Menu items.
const items = [
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
  {
    title: "Galerie",
    url: "/gallery",
    icon: Inbox,
  },
  {
    title: "Profil & Abrechnung",
    url: "/profile",
    icon: User,
  },
  {
    title: "Einstellungen",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Hilfe",
    url: "/help",
    icon: Search,
  },
]

export default function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAdminRole()

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Renovirt</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
    </Sidebar>
  )
}
