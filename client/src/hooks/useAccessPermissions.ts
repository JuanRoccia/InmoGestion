import { useAuth } from "./useAuth";

export interface AccessPermissions {
  canViewProperties: boolean;
  canViewAgencies: boolean;
  canViewLocations: boolean;
  canViewCategories: boolean;
  canViewBanners: boolean;
  canSearchProperties: boolean;
  canViewDetailedProperty: boolean;
  canAccessAgencyDashboard: boolean;
  canCreateAgency: boolean;
  canCreateProperty: boolean;
  canUpdateProperty: boolean;
  canDeleteProperty: boolean;
  canAccessAdminDashboard: boolean;
  canViewFullFeatures: boolean;
  registrationStatus: 'pre-registered' | 'completed' | null;
}

export function useAccessPermissions(): AccessPermissions {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Si no está autenticado o está cargando, no tiene permisos
  if (!isAuthenticated || isLoading || !user) {
    return {
      canViewProperties: false,
      canViewAgencies: false,
      canViewLocations: false,
      canViewCategories: false,
      canViewBanners: false,
      canSearchProperties: false,
      canViewDetailedProperty: false,
      canAccessAgencyDashboard: false,
      canCreateAgency: false,
      canCreateProperty: false,
      canUpdateProperty: false,
      canDeleteProperty: false,
      canAccessAdminDashboard: false,
      canViewFullFeatures: false,
      registrationStatus: null,
    };
  }

  const registrationStatus = (user as any)?.registrationStatus || 'pre-registered';

  // Usuarios pre-registrados: acceso limitado
  if (registrationStatus === 'pre-registered') {
    return {
      canViewProperties: true,           // Puede ver propiedades
      canViewAgencies: true,             // Puede ver agencias
      canViewLocations: true,            // Puede ver ubicaciones
      canViewCategories: true,           // Puede ver categorías
      canViewBanners: true,              // Puede ver banners
      canSearchProperties: true,         // Puede buscar propiedades
      canViewDetailedProperty: true,     // Puede ver detalles de propiedades
      canAccessAgencyDashboard: false,   // No puede acceder al dashboard
      canCreateAgency: false,            // No puede crear agencias
      canCreateProperty: false,          // No puede crear propiedades
      canUpdateProperty: false,          // No puede editar propiedades
      canDeleteProperty: false,          // No puede eliminar propiedades
      canAccessAdminDashboard: false,    // No puede acceder al admin
      canViewFullFeatures: false,        // No tiene acceso completo
      registrationStatus: 'pre-registered',
    };
  }

  // Usuarios con registro completo: acceso total
  return {
    canViewProperties: true,
    canViewAgencies: true,
    canViewLocations: true,
    canViewCategories: true,
    canViewBanners: true,
    canSearchProperties: true,
    canViewDetailedProperty: true,
    canAccessAgencyDashboard: true,
    canCreateAgency: true,
    canCreateProperty: true,
    canUpdateProperty: true,
    canDeleteProperty: true,
    canAccessAdminDashboard: user.email === 'test@inmogestion.com',
    canViewFullFeatures: true,
    registrationStatus: 'completed',
  };
}

/**
 * Hook para verificar rápidamente si el usuario tiene acceso a una funcionalidad específica
 */
export function useHasAccess(feature: keyof Omit<AccessPermissions, 'registrationStatus'>): boolean {
  const permissions = useAccessPermissions();
  return permissions[feature];
}