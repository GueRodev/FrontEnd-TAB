import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import Logo from '@/components/Logo';
import { LogoUploadCard } from '@/components/features/settings';
import { useLogoSettings } from '@/hooks/business';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Archive, Info as InfoIcon } from 'lucide-react';

const AdminLogoPreview = ({ logo }: { logo: string | null }) => {
  if (logo) {
    return (
      <img
        src={logo}
        alt="Admin Logo"
        className="h-8 object-contain"
      />
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
        <span className="text-white font-bold text-sm">A</span>
      </div>
      <span className="font-semibold text-foreground">Admin Panel</span>
    </div>
  );
};

const AdminSettings = () => {
  const {
    logoPreview,
    adminLogoPreview,
    isUploading,
    handleLogoFileChange,
    handleAdminLogoFileChange,
    saveLogo,
    removeLogo,
    saveAdminLogo,
    removeAdminLogo,
    cancelLogoPreview,
    cancelAdminLogoPreview,
  } = useLogoSettings();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader title="Configuración" />
          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <LogoUploadCard
                title="Logo de la Tienda"
                description="Personaliza el logo que aparece en tu tienda online"
                currentLogo={<Logo variant="default" />}
                preview={logoPreview}
                isUploading={isUploading}
                onFileChange={handleLogoFileChange}
                onSave={saveLogo}
                onRemove={removeLogo}
                onCancelPreview={cancelLogoPreview}
              />
              
              <LogoUploadCard
                title="Logo del Sidebar Admin"
                description="Personaliza el logo que aparece en el sidebar del panel de administración"
                currentLogo={<AdminLogoPreview logo={adminLogoPreview} />}
                preview={adminLogoPreview}
                isUploading={isUploading}
                onFileChange={handleAdminLogoFileChange}
                onSave={saveAdminLogo}
                onRemove={removeAdminLogo}
                onCancelPreview={cancelAdminLogoPreview}
              />

              {/* Future Features Documentation */}
              <Card className="border-dashed border-2 border-muted">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                    Funcionalidades Futuras
                  </CardTitle>
                  <CardDescription>
                    Características planificadas para implementar con Laravel Backend
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Recycle Bin Section */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      Papelera de Reciclaje de Categorías
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Sistema de eliminación temporal (Soft Delete) para categorías y subcategorías
                    </p>
                    
                    {/* Implementation Details */}
                    <div className="mt-3 space-y-3">
                      <div className="border-l-2 border-primary pl-3">
                        <h5 className="text-sm font-medium">Flujo de Eliminación</h5>
                        <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                          <li>• Las categorías eliminadas se envían a papelera por 30 días</li>
                          <li>• Los productos asociados se reasignan automáticamente a "Otros"</li>
                          <li>• La categoría "Otros" es default y NO puede eliminarse</li>
                          <li>• Después de 30 días, eliminación permanente automática</li>
                        </ul>
                      </div>
                      
                      <div className="border-l-2 border-primary pl-3">
                        <h5 className="text-sm font-medium">Reglas de Negocio</h5>
                        <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                          <li>✅ Reasignación automática a categoría "Otros"</li>
                          <li>✅ Imposible quedarse sin categorías (mínimo 1)</li>
                          <li>✅ Productos nunca quedan huérfanos</li>
                          <li>✅ Período de gracia de 30 días para restaurar</li>
                          <li>❌ Categoría "Otros" NO eliminable</li>
                        </ul>
                      </div>

                      <div className="border-l-2 border-primary pl-3">
                        <h5 className="text-sm font-medium">Funcionalidades</h5>
                        <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                          <li>• Ver items en papelera (categorías y subcategorías)</li>
                          <li>• Restaurar items antes de 30 días</li>
                          <li>• Eliminar permanentemente de forma manual</li>
                          <li>• Contador de días restantes antes de eliminación</li>
                          <li>• Filtros por tipo (categorías/subcategorías)</li>
                        </ul>
                      </div>

                      <div className="border-l-2 border-primary pl-3">
                        <h5 className="text-sm font-medium">Implementación Backend (Laravel)</h5>
                        <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                          <li>• Trait SoftDeletes en modelos Category y Subcategory</li>
                          <li>• Campo deleted_at en migraciones</li>
                          <li>• Middleware para proteger categoría default</li>
                          <li>• Job programado para hard delete después de 30 días</li>
                          <li>• Endpoints: /recycle-bin, /restore/:id, /force-delete/:id</li>
                        </ul>
                      </div>
                    </div>

                    {/* Coming Soon Badge */}
                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Estado:</strong> Planificado para implementación con conexión Laravel.
                        Esta funcionalidad estará disponible en la sección "Papelera" del menú de administración.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminSettings;
