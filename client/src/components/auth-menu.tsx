import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useAuthModalStore from "@/stores/auth-modal-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { User, LogOut, Building2, Settings, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

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
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      const data = await response.json();

      // Recargar los datos del usuario - esto actualizará el estado automáticamente
      await refetch();

      // Invalidar queries relacionadas para asegurar datos frescos
      queryClient.invalidateQueries();

      setIsOpen(false);

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });

      // Limpiar campos del formulario
      setEmail("");
      setPassword("");
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

  const handlePreRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      const response = await fetch('/api/register/pre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error en el pre-registro');
      }

      const data = await response.json();

      toast({
        title: "¡Pre-registro exitoso!",
        description: "Tu cuenta ha sido creada. Ahora puedes explorar la plataforma.",
      });

      // Hacer login automático después del pre-registro
      const loginResponse = await fetch('/api/login/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
        credentials: 'include',
      });

      if (loginResponse.ok) {
        // Recargar los datos del usuario
        await refetch();

        // Invalidar queries relacionadas
        queryClient.invalidateQueries();

        setIsOpen(false);

        // Limpiar campos
        setRegisterEmail("");
        setRegisterPassword("");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error en el pre-registro",
      });
    } finally {
      setRegisterLoading(false);
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
              Panel de Inmob
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      data-testid="input-password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                      </span>
                    </Button>
                  </div>
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
              <form onSubmit={handlePreRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Correo electrónico</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    data-testid="input-register-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      minLength={6}
                      data-testid="input-register-password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showRegisterPassword ? "Ocultar contraseña" : "Ver contraseña"}
                      </span>
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#ff2e06] hover:bg-[#e62905] text-white"
                  disabled={registerLoading}
                  data-testid="button-register"
                >
                  {registerLoading ? "Registrando..." : "Pre-registrarse"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground">
                Al pre-registrarse, podrás explorar la plataforma. Más tarde podrás completar tu registro y acceder al panel administrativo.
              </p>
            </div>
          </TabsContent >
        </Tabs >
      </DialogContent >
    </Dialog >
  );
}