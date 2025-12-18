#!/bin/bash

echo "🔍 Security Log Checker para tu proyecto"
echo "========================================="
echo ""

LOGS_DIR="./logs"

if [ ! -d "$LOGS_DIR" ]; then
  echo "⚠️  No hay directorio de logs. El sistema de logging no está activo."
  echo "   Implementa el middleware de logging primero."
  exit 1
fi

echo "📊 Resumen de logs:"
if [ -f "$LOGS_DIR/access.log" ]; then
  TOTAL_REQUESTS=$(wc -l < "$LOGS_DIR/access.log")
  echo "   Total de requests: $TOTAL_REQUESTS"

  echo ""
  echo "🔝 Top 10 IPs:"
  awk '{print $6}' "$LOGS_DIR/access.log" | sort | uniq -c | sort -rn | head -10

  echo ""
  echo "🔝 Top 10 endpoints más golpeados:"
  awk '{print $3, $4}' "$LOGS_DIR/access.log" | sort | uniq -c | sort -rn | head -10
else
  echo "   No hay access.log todavía"
fi

echo ""
if [ -f "$LOGS_DIR/security.log" ]; then
  SECURITY_ALERTS=$(grep -c "SUSPICIOUS" "$LOGS_DIR/security.log" 2>/dev/null || echo "0")
  echo "🚨 Alertas de seguridad: $SECURITY_ALERTS"

  if [ "$SECURITY_ALERTS" -gt 0 ]; then
    echo ""
    echo "⚠️  Últimas 5 alertas:"
    tail -50 "$LOGS_DIR/security.log" | grep -A 10 "SUSPICIOUS" | tail -50
  fi
else
  echo "✅ No hay alertas de seguridad"
fi

echo ""
echo "✅ Revisión completada"