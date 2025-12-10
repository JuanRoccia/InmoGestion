import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useAuthModalStore from "@/stores/auth-modal-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  const { user, isAuthenticated, isLoading, refetch } = useAuth();
  const { isOpen, setIsOpen } = useAuthModalStore();
  const { toast } = useToast();
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Si no está autenticado y no está cargando, mostrar el modal
    if (!isLoading && !isAuthenticated) {
      setIsOpen(true);
    }
  }, [isLoading, isAuthenticated, setIsOpen]);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await fetch('/api/login/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });

      // Recargar los datos del usuario
      await refetch();
      setIsOpen(false);

      // Recargar la página para actualizar el estado de autenticación
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Credenciales incorrectas",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-6 h-6 animate-spin border-2 border-[#ff2e06] border-t-transparent rounded-full" />
    );
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-[#ff2e06] hover:bg-[#e62905] text-white"
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
          {user.email === 'test@inmogestion.com' && (
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
          )}
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
          className="bg-[#ff2e06] hover:bg-[#e62905] text-white"
          data-testid="button-auth"
        >
          <User className="h-4 w-4 mr-2" />
          Acceder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acceder a BuscoInmuebles.click</DialogTitle>
          <DialogDescription>
            Para conocer las funcionalidades de nuestra plataforma realice un pre registro.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <div className="space-y-4">
              <form onSubmit={handleLocalLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="test@inmogestion.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#ff2e06] hover:bg-[#e62905] text-white"
                  disabled={loginLoading}
                  data-testid="button-login"
                >
                  {loginLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    O continuar con
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  window.location.href = "/api/login";
                  setIsOpen(false);
                }}
                data-testid="button-google-login"
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