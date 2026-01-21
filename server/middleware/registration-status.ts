import type { RequestHandler } from "express";
import { storage } from "../storage";

/**
 * Middleware para verificar el estado de registro del usuario
 * @param requiredStatus Estado requerido: 'pre-registered' o 'completed'
 * @param allowPreRegistered Si true, permite acceso a usuarios pre-registrados para ciertas operaciones
 */
export function requireRegistrationStatus(
  requiredStatus: 'pre-registered' | 'completed',
  allowPreRegistered: boolean = false
): RequestHandler {
  return async (req, res, next) => {
    const user = req.user as any;

    if (!user || !user.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const dbUser = await storage.getUser(user.claims.sub);
      
      if (!dbUser) {
        return res.status(401).json({ message: "User not found" });
      }

      const currentStatus = dbUser.registrationStatus || 'pre-registered';

      // Si se requiere registro completo y el usuario es pre-registrado
      if (requiredStatus === 'completed' && currentStatus === 'pre-registered') {
        return res.status(403).json({ 
          message: "Registro incompleto",
          error: "Debe completar su registro y suscribirse para acceder a esta funcionalidad"
        });
      }

      // Si se requiere pre-registro pero el usuario ya completó el registro
      if (requiredStatus === 'pre-registered' && currentStatus === 'completed') {
        return res.status(403).json({ 
          message: "Acceso restringido",
          error: "Esta funcionalidad solo está disponible para usuarios pre-registrados"
        });
      }

      // Si no se permite acceso a pre-registrados y el usuario lo es
      if (!allowPreRegistered && currentStatus === 'pre-registered') {
        return res.status(403).json({ 
          message: "Acceso restringido",
          error: "Debe completar su registro para acceder a esta funcionalidad"
        });
      }

      // Agregar el estado de registro al request para que los handlers lo puedan usar
      (req as any).registrationStatus = currentStatus;
      
      next();
    } catch (error) {
      console.error("Error checking registration status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

/**
 * Middleware para permitir acceso solo a usuarios pre-registrados
 */
export const requirePreRegistered = requireRegistrationStatus('pre-registered');

/**
 * Middleware para permitir acceso solo a usuarios con registro completo
 */
export const requireCompletedRegistration = requireRegistrationStatus('completed');

/**
 * Middleware para permitir acceso a usuarios pre-registrados para operaciones básicas
 * pero restringir ciertas funcionalidades avanzadas
 */
export const allowPreRegisteredForBasic = requireRegistrationStatus('completed', true);