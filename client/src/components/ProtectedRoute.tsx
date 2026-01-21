import { useAccessPermissions } from "@/hooks/useAccessPermissions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredFeature?: keyof Omit<AccessPermissions, 'registrationStatus'>;
  redirectTo?: string;
  message?: string;
}

export default function ProtectedRoute({
  children,
  requiredFeature,
  redirectTo = "/subscribe",
  message = "Debe completar su registro para acceder a esta funcionalidad"
}: ProtectedRouteProps) {
  const permissions = useAccessPermissions();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Si se requiere una característica específica y el usuario no tiene acceso
    if (requiredFeature && !permissions[requiredFeature]) {
      // Mostrar mensaje de toast
      toast({
        title: "Acceso restringido",
        description: message,
        variant: "destructive",
      });

      // Redirigir después de un breve delay
      const timer = setTimeout(() => {
        setLocation(redirectTo);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [permissions, requiredFeature, message, redirectTo, setLocation, toast]);

  // Si se requiere una característica y no se tiene acceso, no renderizar nada
  // (el toast y la redirección se encargan de la UX)
  if (requiredFeature && !permissions[requiredFeature]) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Componente para bloquear rutas completamente si no se tiene registro completo
 */
export function RequireCompletedRegistration({ children }: { children: React.ReactNode }) {
  const permissions = useAccessPermissions();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!permissions.canViewFullFeatures) {
      toast({
        title: "Registro incompleto",
        description: "Debe completar su registro y suscribirse para acceder a esta funcionalidad",
        variant: "destructive",
      });

      const timer = setTimeout(() => {
        setLocation("/subscribe");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [permissions.canViewFullFeatures, toast, setLocation]);

  if (!permissions.canViewFullFeatures) {
    return null;
  }

  return <>{children}</>;
}