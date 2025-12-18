import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Crear directorio de logs si no existe
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogPath = path.join(logsDir, "access.log");
const securityLogPath = path.join(logsDir, "security.log");

/**
 * Middleware para loguear todos los accesos HTTP
 */
export function accessLogger(req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const userAgent = req.get("user-agent") || "unknown";
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  const logEntry = `${timestamp} | ${req.method} ${req.path} | IP: ${ip} | UA: ${userAgent}\n`;

  // Escribir de forma asíncrona para no bloquear
  fs.appendFile(accessLogPath, logEntry, (err) => {
    if (err) {
      console.error("❌ Error writing access log:", err.message);
    }
  });

  next();
}

/**
 * Middleware para detectar y loguear peticiones sospechosas
 */
export function securityLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Solo analizar métodos que modifican datos
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return next();
  }

  // Patrones sospechosos que indican posibles ataques
  const suspiciousPatterns = [
    // Code injection
    /eval\s*\(/i,
    /Function\s*\(/i,
    /setTimeout\s*\(/i,
    /setInterval\s*\(/i,

    // Prototype pollution
    /__proto__/i,
    /constructor\s*\.\s*prototype/i,

    // Server-side attacks
    /process\s*\.\s*env/i,
    /require\s*\(/i,
    /import\s*\(/i,
    /child_process/i,
    /fs\s*\.\s*(readFile|writeFile|unlink)/i,

    // XSS
    /<script[^>]*>/i,
    /javascript\s*:/i,
    /onerror\s*=/i,
    /onload\s*=/i,

    // SQL Injection indicators
    /(\bUNION\b.*\bSELECT\b|\bDROP\b.*\bTABLE\b)/i,
    /('\s*OR\s*'1'\s*=\s*'1)/i,

    // Path traversal
    /\.\.[\/\\]/,

    // Command injection
    /[;&|]\s*(rm|cat|ls|wget|curl|bash|sh)\s/i,
  ];

  // Convertir todo a strings para análisis
  const bodyStr = JSON.stringify(req.body || {});
  const paramsStr = JSON.stringify(req.params || {});
  const queryStr = JSON.stringify(req.query || {});
  const headersStr = JSON.stringify(req.headers || {});

  const allData = `${bodyStr} ${paramsStr} ${queryStr} ${headersStr}`;

  // Detectar patrones sospechosos
  const detectedPatterns: string[] = [];
  suspiciousPatterns.forEach((pattern, index) => {
    if (pattern.test(allData)) {
      detectedPatterns.push(`Pattern_${index}: ${pattern.source}`);
    }
  });

  if (detectedPatterns.length > 0) {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    const securityAlert = {
      timestamp,
      severity: "HIGH",
      alert: "🚨 SUSPICIOUS REQUEST DETECTED",
      patterns: detectedPatterns,
      method: req.method,
      path: req.path,
      ip,
      userAgent: req.get("user-agent"),
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const logEntry =
      JSON.stringify(securityAlert, null, 2) + "\n" + "=".repeat(80) + "\n";

    // Escribir a archivo
    fs.appendFile(securityLogPath, logEntry, (err) => {
      if (err) {
        console.error("❌ Error writing security log:", err.message);
      }
    });

    // También loguear en consola para visibilidad inmediata
    console.warn("⚠️  SUSPICIOUS REQUEST DETECTED:", {
      timestamp,
      method: req.method,
      path: req.path,
      ip,
      patternsDetected: detectedPatterns.length,
    });
  }

  next();
}

/**
 * Función helper para rotar logs si crecen mucho (opcional)
 */
export function rotateLogsIfNeeded() {
  const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

  [accessLogPath, securityLogPath].forEach((logPath) => {
    try {
      const stats = fs.statSync(logPath);
      if (stats.size > MAX_LOG_SIZE) {
        const backupPath = `${logPath}.${Date.now()}.bak`;
        fs.renameSync(logPath, backupPath);
        console.log(
          `📦 Log rotated: ${path.basename(logPath)} -> ${path.basename(backupPath)}`,
        );
      }
    } catch (err) {
      // Archivo no existe aún, está bien
    }
  });
}

// Rotar logs cada hora (opcional)
if (process.env.NODE_ENV === "production") {
  setInterval(rotateLogsIfNeeded, 60 * 60 * 1000); // cada hora
}
