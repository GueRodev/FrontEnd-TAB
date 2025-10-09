import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/components/Logo';
import { useAuthForm } from '@/hooks/business';
import { LoginForm, RegisterForm } from '@/components/features/auth';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const {
    loginForm,
    registerForm,
    handleLogin,
    handleRegister,
    isLoading,
  } = useAuthForm();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-brand-darkBlue">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-base">
              Inicia sesión o crea una cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* Tab de Login */}
              <TabsContent value="login">
                <LoginForm
                  form={loginForm}
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                />
              </TabsContent>

              {/* Tab de Register */}
              <TabsContent value="register">
                <RegisterForm
                  form={registerForm}
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>

            {/* Botón provisional para volver al home */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-gray-600 mb-3">
                Acceso provisional (sin autenticación)
              </p>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Continuar sin cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <p>© 2024 Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Auth;
