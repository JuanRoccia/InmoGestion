import { useAuth } from "@/hooks/useAuth";
import useAuthModalStore from "@/stores/auth-modal-store";

export default function AuthOverlay() {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasAuthenticated } = useAuthModalStore();
  
  // No mostrar el overlay si:
  // 1. Está cargando
  // 2. Está autenticado
  // 3. Hay una sesión activa
  // 4. Se ha autenticado previamente en esta sesión
  if (isLoading || isAuthenticated || document.cookie.includes('connect.sid') || hasAuthenticated) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}