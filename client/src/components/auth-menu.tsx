import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import useAuthModalStore from "@/stores/auth-modal-store";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User, LogOut, Building2, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AuthMenu() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isOpen, setIsOpen, hasAuthenticated, setHasAuthenticated } = useAuthModalStore();

  useEffect(() => {
    // Si el usuario está autenticado, actualizar el estado persistente
    if (isAuthenticated) {
      setHasAuthenticated(true);
    }
    
    // Solo mostrar el modal si:
    // 1. No está cargando
    // 2. No está autenticado
    // 3. No hay una sesión activa
    // 4. No se ha autenticado previamente en esta sesión
    if (!isLoading && !isAuthenticated && !document.cookie.includes('connect.sid') && !hasAuthenticated) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isLoading, isAuthenticated, setIsOpen, hasAuthenticated, setHasAuthenticated]);

  if (isLoading) {
    return (
      <div className="w-6 h-6 animate-spin border-2 border-[#FF5733] border-t-transparent rounded-full" />
    );
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="bg-[#FF5733] hover:bg-[#ff6e52] text-white" 
            data-testid="button-account"
          >
            <User className="h-4 w-4 mr-2" />
            Mi cuenta
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link 
              href="/agency-dashboard" 
              className="cursor-pointer flex items-center" 
              data-testid="link-agency-dashboard"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Panel de Agencia
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link 
              href="/admin-dashboard" 
              className="cursor-pointer flex items-center" 
              data-testid="link-admin-dashboard"
            >
              <Settings className="h-4 w-4 mr-2" />
              Panel de Admin
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a 
              href="/api/logout" 
              className="cursor-pointer flex items-center text-red-600 hover:text-red-700" 
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
      onInteractOutside={(e) => {
        // Prevenir el cierre del modal si no está autenticado
        if (!isAuthenticated) {
          e.preventDefault();
        }
      }}
      onEscapeKeyDown={(e) => {
        // Prevenir el cierre del modal con ESC si no está autenticado
        if (!isAuthenticated) {
          e.preventDefault();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button 
          className="bg-[#FF5733] hover:bg-[#ff6e52] text-white"
          data-testid="button-auth"
        >
          <User className="h-4 w-4 mr-2" />
          Acceder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acceder a BuscoInmueble.click</DialogTitle>
          <DialogDescription>
            Inicie sesión o regístrese para acceder a todas las funcionalidades.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <div className="space-y-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                const password = formData.get('password') as string;

                try {
                  const response = await fetch('/api/auth/local', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include' // Importante: incluir cookies en la solicitud
                  });

                  if (!response.ok) {
                    throw new Error('Invalid credentials');
                  }

                  // Marcar como autenticado
                  setHasAuthenticated(true);
                  setIsOpen(false);

                  // Actualizar el estado de autenticación
                  await refetch();
                  
                  // Recargar la página después de un breve retraso
                  setTimeout(() => {
                    window.location.href = '/admin-dashboard';
                  }, 100);
                } catch (error) {
                  console.error('Error logging in:', error);
                }
              }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#FF5733] hover:bg-[#ff6e52] text-white">
                    Iniciar Sesión
                  </Button>
                </div>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O</span>
                </div>
              </div>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => {
                  window.location.href = "/api/login";
                  setIsOpen(false);
                }}
              >
                Iniciar Sesión con Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Al iniciar sesión, acepta nuestros términos y condiciones.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <div className="space-y-4">
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => {
                  window.location.href = "/subscribe";
                  setIsOpen(false);
                }}
              >
                Registrar mi Inmobiliaria
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Únase a nuestra red de inmobiliarias y comience a publicar propiedades.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}