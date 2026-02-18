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
  const [scrollProgress, setScrollProgress] = useState(0);

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

  useEffect(() => {
    const heroElement = document.getElementById('hero-search');
    if (!heroElement) return;

    const heroHeight = heroElement.offsetHeight;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerPoint = heroHeight * 0.99;
      const progress = Math.max(0, Math.min(1, scrollY / triggerPoint));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isInHero = scrollProgress < 0.04;
  const isTransitioning = scrollProgress >= 0.04 && scrollProgress <= 0.4;

  const getBackgroundStyle = () => {
    if (scrollProgress > 0.3) {
      return { background: 'linear-gradient(to right, #ff2e06, #e62905)' };
    }
    if (isTransitioning) {
      const ratio = scrollProgress * 5;
      const r = 255;
      const g = Math.round(255 - (255 - 46) * ratio);
      const b = Math.round(255 - (255 - 6) * ratio);
      const r2 = Math.round(255 - (255 - 230) * ratio);
      const g2 = Math.round(255 - (255 - 41) * ratio);
      const b2 = Math.round(255 - (255 - 5) * ratio);
      return {
        background: `linear-gradient(to right, rgb(${r}, ${g}, ${b}), rgb(${r2}, ${g2}, ${b2}))`,
      };
    }
    return { background: '#FFFFFF' };
  };

  const getTextColor = () => {
    if (scrollProgress > 0.3) return '#FFFFFF';
    if (isTransitioning) {
      return scrollProgress < 0.1 ? '#212121' : '#FFFFFF';
    }
    return '#212121';
  };

  const getSubtextColor = () => {
    if (scrollProgress > 0.3) return 'rgba(255, 255, 255, 0.9)';
    if (isTransitioning) {
      return scrollProgress < 0.1 ? '#757575' : 'rgba(255, 255, 255, 0.9)';
    }
    return '#757575';
  };

  const isButtonInverted = scrollProgress > 0.1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div 
        className={`max-w-4xl mx-auto rounded-lg border shadow-[0_0_30px_rgba(255,46,6,0.3)] p-6 flex items-center justify-between gap-4 transition-all duration-300 ease-out ${isInHero ? 'border-primary/30' : 'border-white/30'}`}
        style={getBackgroundStyle()}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`rounded-full p-3 transition-all duration-300 ${isInHero ? 'bg-primary/10' : 'bg-white/20'}`}>
            <Building2 className={`h-6 w-6 transition-colors duration-300`} style={{ color: getTextColor() }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 transition-colors duration-300" style={{ color: getTextColor() }}>
              Ingresar al panel administrativo de inmobiliarias
            </h3>
            <p className="text-sm transition-colors duration-300" style={{ color: getSubtextColor() }}>
              Completa tu registro y accede a todas las funcionalidades para gestionar tus propiedades.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGoToRegister}
            className="font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: isButtonInverted ? '#FFFFFF' : '#ff2e06',
              color: isButtonInverted ? '#ff2e06' : '#FFFFFF',
            }}
            size="lg"
          >
            Completar Registro
          </Button>
          <button
            onClick={handleClose}
            className="transition-colors duration-300 p-2"
            style={{ color: getTextColor() }}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
