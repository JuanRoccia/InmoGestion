import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { X, Building2 } from "lucide-react";
import { useLocation } from "wouter";

export default function RegistrationInviteBanner() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showBanner, setShowBanner] = useState(false);
  const [hasSeenBanner, setHasSeenBanner] = useState(false);

  useEffect(() => {
    // Solo mostrar si el usuario está autenticado, es pre-registrado y no ha visto el banner
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    // Verificar si es usuario pre-registrado
    const registrationStatus = (user as any).registrationStatus;
    if (registrationStatus !== 'pre-registered') {
      return;
    }

    // Verificar si ya vio el banner en esta sesión
    const bannerKey = `hasSeenRegistrationInvite_${user.id}`;
    const seen = sessionStorage.getItem(bannerKey);
    if (seen === 'true') {
      setHasSeenBanner(true);
      return;
    }

    // Mostrar banner después de 10 segundos de exploración
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, user]);

  const handleClose = () => {
    setShowBanner(false);
    setHasSeenBanner(true);
    if (user) {
      const bannerKey = `hasSeenRegistrationInvite_${user.id}`;
      sessionStorage.setItem(bannerKey, 'true');
    }
  };

  const handleGoToRegister = () => {
    setLocation('/subscribe');
    handleClose();
  };

  // No mostrar si no cumple las condiciones
  if (
    isLoading ||
    !isAuthenticated ||
    !user ||
    (user as any).registrationStatus !== 'pre-registered' ||
    hasSeenBanner ||
    !showBanner
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#ff2e06] to-[#e62905] text-white rounded-lg shadow-2xl p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-white/20 rounded-full p-3">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Ingresar al panel administrativo de inmobiliarias
            </h3>
            <p className="text-sm text-white/90">
              Completa tu registro y accede a todas las funcionalidades para gestionar tus propiedades.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGoToRegister}
            className="bg-white text-[#ff2e06] hover:bg-white/90 font-semibold"
            size="lg"
          >
            Completar Registro
          </Button>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-2"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
