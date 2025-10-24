import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

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
    <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
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
              <Button 
                className="w-full bg-[#FF5733] hover:bg-[#ff6e52] text-white"
                onClick={() => {
                  window.location.href = "/api/login";
                  setIsAuthDialogOpen(false);
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
                  setIsAuthDialogOpen(false);
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