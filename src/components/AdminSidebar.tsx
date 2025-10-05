import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  FolderTree, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  LogOut,
  Package2,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { state, open, isMobile, openMobile } = useSidebar();
  const isCollapsed = isMobile ? !openMobile : (state === "collapsed" && !open);
  
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const logo = localStorage.getItem('customAdminLogo');
    setCustomLogo(logo);

    const handleLogoUpdate = () => {
      const updatedLogo = localStorage.getItem('customAdminLogo');
      setCustomLogo(updatedLogo);
    };

    window.addEventListener('adminLogoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('adminLogoUpdated', handleLogoUpdate);
  }, []);

  return (
    <Sidebar 
      className="!bg-[#1A1F2C] border-none" 
      style={{ backgroundColor: '#1A1F2C' }}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <div className={`p-6 border-b border-white/10 bg-[#1A1F2C] ${isCollapsed ? 'flex justify-center' : ''}`}>
        {customLogo ? (
          <Link to="/admin" className="flex items-center justify-center">
            <img 
              src={customLogo} 
              alt="Logo Admin" 
              className={`object-contain ${isCollapsed ? 'h-10 w-10' : 'h-12'}`}
            />
          </Link>
        ) : (
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
        )}
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

      {/* User Section - TODO: Aquí se implementa el nombre del usuario logueado */}
      <div className="!bg-[#1A1F2C] border-t border-white/10 p-4" style={{ backgroundColor: '#1A1F2C' }}>
        <Link 
          to="/admin/perfil" 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Avatar className="h-10 w-10 border-2 border-white/10">
            <AvatarImage src="" alt="Admin" />
            <AvatarFallback className="bg-[#F97316] text-white font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm font-medium truncate">
                Admin Usuario
              </span>
              <span className="text-white/60 text-xs truncate">
                admin@toysandbricks.com
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Footer Section */}
      <SidebarFooter className="!bg-[#1A1F2C] border-t border-white/10" style={{ backgroundColor: '#1A1F2C' }}>
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
