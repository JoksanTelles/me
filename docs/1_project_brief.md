# Project Brief: Joksan.dev Platform

**Date:** 27/11/2024
**Version:** 1.0.0 (Final)
**Status:** Approved
**Author:** Mary (Business Analyst)

## 1. Executive Summary
**Joksan.dev** será una plataforma web personal progresiva (PWA) diseñada para unificar la identidad profesional y creativa de Joksan. Fusiona un portafolio técnico de alto nivel con una experiencia de lectura inmersiva para novelas y bitácoras de desarrollo (DevLogs). La plataforma se distingue por su arquitectura "Headless" que garantiza costos operativos cero, rendimiento en el borde (Edge) y una gestión de contenido visual sin fricción.

## 2. Problem Statement
**Current State:** El contenido de Joksan (desarrollo de software, escritura de novelas, creación de videojuegos) está fragmentado o no tiene un hogar digital que soporte formatos tan dispares con la calidad deseada.
**Pain Points:**
* Las plataformas de escritura existentes no permiten personalización técnica ni dominio propio.
* Los sitios de portafolio estáticos son difíciles de actualizar con contenido dinámico (capítulos nuevos).
* Mantener múltiples sitios web genera costos y deuda técnica.
**Impact:** Pérdida de audiencia cruzada y dificultad para mostrar una marca personal cohesiva.

## 3. Proposed Solution
Una aplicación **Nuxt 3** desplegada en **Cloudflare Pages**, utilizando **Storyblok** como CMS visual para la gestión de novelas y artículos. La interfaz será construida con **Shadcn-vue** para garantizar una estética única y control total del código.

**Key Differentiators:**
* **Arquitectura "Zero-Cost":** Uso estratégico de capas gratuitas (Cloudflare, Storyblok, Kit, OneSignal) para escalar sin inversión inicial.
* **Hybrid Rendering:** Velocidad de sitio estático (SSG) con regeneración dinámica (ISR) para evitar tiempos de compilación largos.
* **Unified Experience:** Un solo sitio que sirve tanto a un reclutador técnico como a un lector de ficción ávido.

## 4. Target Users
1.  **Lectores de Ficción:** Buscan inmersión, modo oscuro, lectura offline y notificaciones de nuevos capítulos.
2.  **Reclutadores & Clientes Tech:** Buscan validar habilidades en Vue/Nuxt, arquitectura y calidad de código a través de Case Studies.
3.  **Comunidad Game Dev:** Buscan DevLogs técnicos y recursos.

## 5. Goals & Success Metrics
* **Performance:** Lighthouse Score > 95 (Core Web Vitals) en Móvil y Desktop.
* **Efficiency:** Tiempo de publicación de un nuevo capítulo < 5 minutos (Desde Storyblok al usuario final).
* **Engagement:** Crecimiento de la lista de correo en **Kit** (10k subs capacity) y suscriptores Push (**OneSignal**).
* **Compliance:** PWA instalable con funcionalidad básica offline.

## 6. MVP Scope (Must Have)
* **Páginas Core:**
    * Inicio (Híbrido: Perfil + Últimas actualizaciones).
    * Portafolio (Listado + Detalle de Proyectos).
    * DevLogs (Blog técnico con categorías).
    * Archivero (Wiki/Digital Garden).
* **Motor de Historias (Novelas):**
    * Índice de Colecciones/Tomos.
    * Visor de Lectura (Capítulo) con navegación intuitiva y tipografía optimizada.
* **Funcionalidades Técnicas:**
    * PWA (Instalable).
    * i18n (Español / Inglés).
    * Dark/Light Mode.
    * Suscripción a Newsletter (API Kit).
    * Notificaciones Push (OneSignal).

## 7. Technical Considerations
* **Frontend Framework:** Nuxt 3 (TypeScript).
* **UI Library:** **Shadcn-vue** + Tailwind CSS + Lucide Icons.
* **CMS:** Storyblok (Visual Editor).
* **Assets/Media:** Cloudinary (vía Plugin Storyblok).
* **Hosting/Edge:** Cloudflare Pages + Workers.
* **Marketing Tech:** Kit (Email), OneSignal (Push), Carbon Ads (Ads).

## 8. Constraints & Assumptions
* **Presupuesto:** $0/mes (Strict Free Tier).
* **Recursos:** 1 Desarrollador (Joksan).
* **Mantenimiento:** El código debe ser lo suficientemente limpio para no requerir "refactoring" constante, delegando la gestión de contenido 100% al CMS.