# Entrega 0 - Arquitectura de Sistemas

**Estudiante:** Víctor Castillo

## 1. Información del Despliegue
- **IP Pública (Nginx / API):** http://15.229.19.60
- **Repositorio de GitHub:** https://github.com/vitoco11/IIC2173-E0

## 2. Accesos y Credenciales (Adjuntos en el ZIP de Canvas)
- **Llave SSH:** Archivo `.pem` para conectarse a la instancia EC2.
- **Credenciales IAM:** Archivo `.csv` con el acceso de solo lectura (ReadOnlyAccess) para la revisión en la consola de AWS.

## 3. Arquitectura Implementada
- **Base de Datos:** PostgreSQL (containerizado, con persistencia JSONB).
- **Master (API):** Node.js / Express (containerizado).
- **Connector (Worker):** Node.js / amqplib (containerizado).
- **Orquestación:** Docker Compose con Healthchecks configurados.
- **Proxy Inverso:** Nginx configurado directamente sobre Ubuntu en EC2.