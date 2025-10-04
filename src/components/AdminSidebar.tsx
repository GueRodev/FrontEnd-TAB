import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  FolderTree, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  LogOut,
  Package2
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Inicio", url: "/admin", icon: BarChart3 },
  { title: "Productos", url: "/admin/productos", icon: Package },
  { title: "Categorías", url: "/admin/categorias", icon: FolderTree },
  { title: "Usuarios", url: "/admin/usuarios", icon: Users },
  { title: "Pedidos", url: "/admin/pedidos", icon: ShoppingCart },
  { title: "Finanzas", url: "/admin/finanzas", icon: DollarSign },
];

const footerItems = [
  { title: "Configuración", url: "/admin/configuracion", icon: Settings },
  { title: "Cerrar Sesión", url: "/", icon: LogOut },
];

export function AdminSidebar() {
  return (
    <Sidebar className="bg-brand-darkBlue border-none">
      {/* Header with Logo Icon */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-brand-orange p-2 rounded-lg">
            <Package2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg">TOYS AND</span>
            <span className="text-brand-orange font-bold text-lg">BRICKS</span>
          </div>
        </div>
      </div>

      <SidebarContent className="bg-brand-darkBlue">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70 text-xs font-semibold uppercase tracking-wider px-4 py-3">
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="text-white hover:bg-white/10 data-[active=true]:bg-white/20 px-4 py-3"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="bg-brand-darkBlue border-t border-white/10 mt-auto">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className="text-white hover:bg-white/10 px-4 py-3"
              >
                <Link to={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
