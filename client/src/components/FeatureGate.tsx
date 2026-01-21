import { useAccessPermissions } from "@/hooks/useAccessPermissions";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface FeatureGateProps {
  children: React.ReactNode;
  feature: keyof Omit<AccessPermissions, 'registrationStatus'>;
  message?: string;
  showUpgradeButton?: boolean;
}

/**
 * Componente que muestra diferentes contenidos según el permiso del usuario
 */
export default function FeatureGate({ 
  children, 
  feature, 
  message = "Esta funcionalidad está disponible para usuarios con registro completo",
  showUpgradeButton = true 
}: FeatureGateProps) {
  const permissions = useAccessPermissions();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Si el usuario tiene acceso, mostrar el contenido
  if (permissions[feature]) {
    return <>{children}</>;
  }

  // Si no tiene acceso, mostrar mensaje de bloqueo
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <div className="text-yellow-600 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Funcionalidad restringida</h3>
      <p className="text-yellow-700 mb-4">{message}</p>
      {showUpgradeButton && (
        <button
          onClick={() => {
            toast({
              title: "Registro requerido",
              description: "Redirigiendo al proceso de registro...",
            });
            setLocation('/subscribe');
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Completar Registro
        </button>
      )}
    </div>
  );
}

/**
 * Componente que muestra un botón de acción condicional
 */
export function ConditionalActionButton({ 
  children, 
  feature, 
  onClick, 
  className = "",
  disabledMessage = "Debe completar su registro para acceder a esta funcionalidad"
}: {
  children: React.ReactNode;
  feature: keyof Omit<AccessPermissions, 'registrationStatus'>;
  onClick: () => void;
  className?: string;
  disabledMessage?: string;
}) {
  const permissions = useAccessPermissions();
  const { toast } = useToast();

  const handleClick = () => {
    if (!permissions[feature]) {
      toast({
        title: "Acceso restringido",
        description: disabledMessage,
        variant: "destructive",
      });
      return;
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!permissions[feature]}
      className={`${className} ${!permissions[feature] ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}