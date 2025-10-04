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
  useSidebar,
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
  const { state, open } = useSidebar();
  const isCollapsed = state === "collapsed" && !open;

  return (
    <Sidebar 
      className="!bg-[#1A1F2C] border-none" 
      style={{ backgroundColor: '#1A1F2C' }}
      collapsible="icon"
    >
      {/* Header with Logo Icon */}
      <div className={`p-6 border-b border-white/10 bg-[#1A1F2C] ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="bg-[#F97316] p-2.5 rounded-lg flex-shrink-0">
            <Package2 className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-base tracking-wide">TOYS AND</span>
              <span className="text-[#F97316] font-bold text-base tracking-wide">BRICKS</span>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="!bg-[#1A1F2C]" style={{ backgroundColor: '#1A1F2C' }}>
        <SidebarGroup className="bg-[#1A1F2C]">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-white/70 text-xs font-semibold uppercase tracking-wider px-4 py-3">
              Menú Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="text-white hover:bg-[#F97316]/20 hover:text-[#F97316] data-[active=true]:bg-[#F97316] data-[active=true]:text-white px-4 py-3 transition-all duration-200"
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="!bg-[#1A1F2C] border-t border-white/10 mt-auto" style={{ backgroundColor: '#1A1F2C' }}>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className="text-white hover:bg-[#F97316]/20 hover:text-[#F97316] px-4 py-3 transition-all duration-200"
                tooltip={isCollapsed ? item.title : undefined}
              >
                <Link to={item.url}>
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium">{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
