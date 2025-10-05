import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

const AdminConfiguracion = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const customLogo = localStorage.getItem('customLogo');
    if (customLogo) {
      setLogoPreview(customLogo);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setLogoPreview(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Error al leer el archivo",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = () => {
    if (!logoPreview) return;

    localStorage.setItem('customLogo', logoPreview);
    toast({
      title: "Logo actualizado",
      description: "El logo se ha guardado correctamente",
    });

    // Trigger a custom event to notify Logo component
    window.dispatchEvent(new Event('logoUpdated'));
  };

  const handleRemoveLogo = () => {
    localStorage.removeItem('customLogo');
    setLogoPreview(null);
    toast({
      title: "Logo restaurado",
      description: "Se ha restaurado el logo por defecto",
    });

    // Trigger a custom event to notify Logo component
    window.dispatchEvent(new Event('logoUpdated'));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader title="Configuración" />
          
          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Logo Configuration Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo de la Tienda</CardTitle>
                  <CardDescription>
                    Personaliza el logo que aparece en tu tienda. Se recomienda una imagen cuadrada o rectangular horizontal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Logo Preview */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Vista Previa Actual</Label>
                    <div className="border rounded-lg p-6 bg-muted/30 flex items-center justify-center min-h-[120px]">
                      <Logo variant="default" />
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="space-y-4">
                    <Label htmlFor="logo-upload" className="text-sm font-medium">
                      Subir Nuevo Logo
                    </Label>
                    
                    {logoPreview && (
                      <div className="border rounded-lg p-4 bg-background">
                        <div className="flex items-start gap-4">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-24 h-24 object-contain rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                              Nueva imagen seleccionada
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLogoPreview(null)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        disabled={isUploading}
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Seleccionar
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Formatos aceptados: PNG, JPG, WEBP. Tamaño máximo: 2MB
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleSaveLogo}
                      disabled={!logoPreview || isUploading}
                      className="flex-1"
                    >
                      Guardar Logo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRemoveLogo}
                      disabled={isUploading}
                    >
                      Restaurar Logo por Defecto
                    </Button>
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

export default AdminConfiguracion;
