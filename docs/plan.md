# 🚀 Project Plan: Joksan.dev

Este documento detalla la arquitectura distribuida y el stack tecnológico avanzado para la plataforma personal de Joksan.

## 🛠️ Stack Tecnológico (Arquitectura Distribuida)

### 1. Frontend: [Astro](https://astro.build/) + [Bun](https://bun.sh/)
*   **Runtime:** **Bun** (en reemplazo de Node.js) para una velocidad superior en desarrollo y builds.
*   **UI:** Tailwind CSS + Vue 3 (Islands).
*   **Hosting:** **Cloudflare Pages**.
*   **Marketing:** Integración de **Kit (ConvertKit)** para captación de leads y campañas.

### 2. Backend: [Go](https://go.dev/) + [SQLite](https://www.sqlite.org/)
*   **Servidor Web:** **Caddy** como reverse proxy (con HTTPS automático).
*   **Email:** **Zeptomail** para el envío de correos transaccionales (confirmaciones de contacto, etc.).
*   **Hosting:** **VPS** dedicado.
*   **Base de Datos:** SQLite (local en el VPS).

### 3. Almacenamiento & Assets
*   **Storage:** **Cloudflare R2** para imágenes de proyectos, artículos y otros assets estáticos.

---

## 🏗️ Infraestructura y Despliegue (Sin Docker)

| Componente | Entorno | Detalle |
| :--- | :--- | :--- |
| **Frontend** | Cloudflare Pages | Despliegue automático desde Git. |
| **Backend** | VPS (Linux) | Binario de Go ejecutándose como servicio (systemd). |
| **Proxy** | Caddy | Manejo de subdominios (ej. `api.joksan.dev`) y SSL. |
| **Storage** | Cloudflare R2 | Acceso vía S3-compatible API desde el backend o Astro. |

---

## 🗺️ Hoja de Ruta Actualizada

### Fase 1: Entorno y Backend (Día 1)
*   [ ] Configurar **Bun** localmente para el frontend.
*   [ ] **Backend (Go)**: 
    *   Setup del servidor base.
    *   Integración con el SDK/API de **Zeptomail**.
    *   Módulo de persistencia con SQLite.
    *   Configuración inicial de **Caddy** en el VPS.

### Fase 2: Frontend e Integraciones
*   [ ] **Astro**:
    *   Setup con Bun y Tailwind.
    *   Integración del formulario de **Kit** para newsletters.
    *   Conexión con el backend de Go para el formulario de contacto.
*   [ ] **R2 Integration**: Configurar el pipeline para subir/servir imágenes desde Cloudflare R2.

### Fase 3: Optimización y Lanzamiento
*   [ ] Pruebas de flujo: Formulario -> Go Backend -> Zeptomail -> Inbox.
*   [ ] Configuración de SEO avanzado y Web Vitals.

---

## 📈 Consideraciones de Implementación

*   **Seguridad**: El backend en Go debe validar el `Origin` para permitir peticiones solo desde el dominio de Cloudflare Pages.
*   **Performance**: Al usar Bun, las dependencias y el tiempo de compilación del frontend serán casi instantáneos.
*   **No Docker**: El despliegue se hará vía binario nativo en el VPS y build nativo en Cloudflare, maximizando el uso de recursos.
*   **Scalability**: R2 garantiza que los assets no consuman el espacio en disco limitado del VPS.
