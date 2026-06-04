import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Define the items for the sidebar
const mainItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: "dashboard" },
  { title: "Cursos", url: "/admin/cursos", icon: "school" },
  { title: "Pedidos", url: "/admin/pedidos", icon: "shopping_cart" },
  { title: "Blog", url: "/admin/blog", icon: "article" },
  { title: "Usuarios", url: "/admin/usuarios", icon: "group" },
]

const systemItems = [
  { title: "Ver sitio web", url: "/", icon: "public" },
]

export function AppSidebar({ activePath }: { activePath?: string }) {
  const logout = () => {
    document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/admin/login';
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-xl font-bold tracking-wider uppercase text-primary">
            Joksan<span className="text-foreground">Admin</span>
          </h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={activePath === item.url || (item.url !== '/admin/dashboard' && activePath?.startsWith(item.url))}>
                    <a href={item.url}>
                      <span className="material-symbols-outlined text-[18px] mr-2">{item.icon}</span>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span className="material-symbols-outlined text-[18px] mr-2">{item.icon}</span>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                  <span className="material-symbols-outlined text-[18px] mr-2">logout</span>
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
