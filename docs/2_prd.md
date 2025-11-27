# Product Requirements Document (PRD): Joksan.dev Platform

**Project:** Joksan.dev Platform
**Version:** 1.0
**Status:** Draft
**Date:** 27/11/2024

## 1. Goals and Background Context

### Goals
* **Unificar Identidad:** Centralizar el perfil profesional (Dev) y creativo (Escritor/GameDev) en una sola URL.
* **Experiencia de Lectura Premium:** Ofrecer una UX de lectura para novelas superior a Wattpad/PDFs, con carga instantánea y modo oscuro.
* **Costo Operativo Cero:** Mantener la infraestructura 100% en capas gratuitas (Cloudflare, Storyblok, Kit, OneSignal).
* **Alto Rendimiento:** Alcanzar puntuaciones Lighthouse >95 en Core Web Vitals mediante renderizado híbrido.
* **Captura de Audiencia:** Facilitar la suscripción a newsletter y notificaciones push sin fricción.

### Background Context
El usuario (Joksan) posee contenido de alto valor disperso o no publicado por falta de una plataforma adecuada. Las soluciones existentes (CMS tradicionales) son costosas o rígidas. Se requiere una solución a medida ("The Infinite Free-Tier Stack") que permita publicar novelas por capítulos y devlogs técnicos con facilidad, aprovechando tecnologías modernas como Nuxt 3 y PWA.

### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 27/11/2024 | 1.0 | Initial Draft based on Project Brief | John (PM) |

## 2. Requirements

### Functional Requirements (FR)
* **FR1 - Content Management:** El sistema debe permitir crear, editar y publicar Historias, Capítulos, DevLogs y Proyectos desde un editor visual (Storyblok) sin tocar código.
* **FR2 - Internationalization:** El sitio debe soportar rutas y contenido en Español (default) e Inglés (`/en`), persistiendo la preferencia del usuario.
* **FR3 - Reading Engine:** El visor de capítulos debe permitir navegación lineal (Anterior/Siguiente), recordar la posición de lectura (opcional V2, deseable V1) y ofrecer tipografía legible.
* **FR4 - Subscription:** Los usuarios deben poder suscribirse a la newsletter (Kit) mediante un formulario que conecte vía API segura.
* **FR5 - Notifications:** Los usuarios deben poder activar notificaciones Push (OneSignal) para nuevos contenidos.

### Non-Functional Requirements (NFR)
* **NFR1 - Performance:** First Contentful Paint (FCP) < 1.5s en 4G.
* **NFR2 - SEO:** Generación automática de sitemap.xml y meta-tags dinámicos para cada historia y artículo.
* **NFR3 - Accessibility:** Cumplimiento WCAG AA (colores, contraste, navegación por teclado), facilitado por Shadcn-vue.
* **NFR4 - Availability:** Despliegue en el Edge (Cloudflare) para alta disponibilidad global.

## 3. UI/UX Design Goals

### Overall UX Vision
Minimalismo centrado en el contenido ("Content-first"). La interfaz debe "desaparecer" cuando el usuario está leyendo una novela. Estética profesional pero con toques de personalidad "Indie Dev".

### Core Screens
1.  **Landing Page:** Híbrida. Hero section profesional + Grid de últimas actualizaciones (Historias/DevLogs).
2.  **Story Index (La Biblioteca):** Grid de portadas de libros/colecciones.
3.  **Chapter Viewer (El Lector):** Diseño libre de distracciones, tipografía *Serif* para cuerpo, *Sans* para UI. Barra de progreso de lectura.
4.  **Portfolio Detail:** Layout tipo "Case Study" con soporte para galerías de imágenes y bloques de código.

### Branding & Theming
* **Librería UI:** **Shadcn-vue** (limpieza, accesibilidad).
* **Iconografía:** Lucide Icons.
* **Modo Oscuro:** Ciudadano de primera clase (Default: Sistema). Paleta de colores de alto contraste pero suave para la vista (Slate/Zinc).

## 4. Technical Assumptions

* **Repository:** Monorepo (GitHub).
* **Frontend:** Nuxt 3 + TypeScript.
* **Styling:** Tailwind CSS + Shadcn-vue.
* **CMS:** Storyblok (API-based).
* **Deploy:** Cloudflare Pages (Adapter: Cloudflare Workers).
* **Assets:** Cloudinary (vía Storyblok plugin).

## 5. Epic List

La ejecución se dividirá en 4 Epics secuenciales para garantizar valor incremental.

* **Epic 1: Foundation & Infrastructure:** Configuración del "esqueleto" (Nuxt, Shadcn, Storyblok, Cloudflare) y Landing Page base.
* **Epic 2: The Professional Core:** Portafolio, Archivero y DevLogs (Estructuras de contenido estándar).
* **Epic 3: The Storyteller Engine:** El motor especializado para Novelas y Capítulos (La funcionalidad más compleja).
* **Epic 4: Audience & Growth:** Integraciones de Marketing (Kit, OneSignal, SEO, Analytics) y PWA final.

## 6. Epic Details

### Epic 1: Foundation & Infrastructure
**Goal:** Establecer la arquitectura base, pipeline de despliegue y sistema de diseño. Al finalizar, el sitio debe estar "vivo" en internet con una página de inicio básica.

* **Story 1.1: Project Setup**
    * **As a** Developer, **I want** to initialize the Nuxt 3 project with Tailwind, Shadcn-vue and i18n, **so that** I have a solid codebase to work on.
    * *AC:* Repo creado, Nuxt instalado, Shadcn configurado con un tema base, despliegue automático en Cloudflare Pages funcionando.

* **Story 1.2: CMS Connection**
    * **As a** Content Creator, **I want** to connect Nuxt to Storyblok, **so that** I can retrieve content dynamically.
    * *AC:* Módulo `@storyblok/nuxt` instalado, Token configurado en variables de entorno, renderizado de una página "Hello World" desde el CMS.

* **Story 1.3: Global Layout & Navigation**
    * **As a** User, **I want** a responsive navigation bar and footer, **so that** I can explore the site.
    * *AC:* Navbar con enlaces (Inicio, Historias, DevLog...), Footer con redes sociales, Toggle de Modo Oscuro funcional.

### Epic 2: The Professional Core (Portfolio & DevLogs)
**Goal:** Habilitar las secciones de contenido "profesional" y técnico.

* **Story 2.1: Content Modeling (Portfolio/DevLog)**
    * **As a** Content Creator, **I want** to define the fields for "Projects" and "Posts" in Storyblok, **so that** I can input structured data.
    * *AC:* "Content Types" creados en Storyblok (Título, Slug, Fecha, Tags, Rich Text, Imagen de Portada Cloudinary).

* **Story 2.2: DevLog Listing & Detail**
    * **As a** Visitor, **I want** to see a list of devlogs and read individual posts, **so that** I can follow development updates.
    * *AC:* Página `/devlog` con paginación/grid. Página `/devlog/{slug}` con renderizado de Rich Text y bloques de código (highlight.js/shiki).

* **Story 2.3: Portfolio Section**
    * **As a** Recruiter, **I want** to browse case studies via `/portfolio`, **so that** I can evaluate Joksan's skills.
    * *AC:* Diseño visualmente distinto al blog (más visual). Cards de proyectos con tecnologías usadas.

### Epic 3: The Storyteller Engine (Novelas)
**Goal:** Crear la experiencia de lectura inmersiva para las historias.

* **Story 3.1: Story Data Architecture**
    * **As a** Writer, **I want** a hierarchical structure in the CMS (Collection -> Chapters), **so that** I can organize vast amounts of text.
    * *AC:* Modelo "Collection" (Libro) y modelo "Chapter" (Hijo de Collection). Relación padre-hijo funcionando en Storyblok.

* **Story 3.2: The Library (Index)**
    * **As a** Reader, **I want** to see the available books/stories at `/stories`, **so that** I can choose what to read.
    * *AC:* Grid de portadas de libros. Metadata (Género, Estado: En progreso/Terminado).

* **Story 3.3: The Reader (Chapter View)**
    * **As a** Reader, **I want** a distraction-free interface to read a chapter, **so that** I can immerse myself in the story.
    * *AC:* Tipografía optimizada (tamaño/interlineado). Botones "Capítulo Anterior" y "Capítulo Siguiente" grandes y accesibles. Sin sidebars molestos.

### Epic 4: Audience & Growth
**Goal:** Convertir visitantes en suscriptores y asegurar que la App sea instalable.

* **Story 4.1: Kit (Newsletter) Integration**
    * **As a** User, **I want** to subscribe to the newsletter via a simple form, **so that** I get email updates.
    * *AC:* Endpoint API en Nuxt (Server route) que proxyfica la petición a la API de Kit (para ocultar tokens). Formulario UI con validación y manejo de errores.

* **Story 4.2: OneSignal Push**
    * **As a** User, **I want** to enable push notifications, **so that** I know instantly when a chapter is out.
    * *AC:* Integración OneSignal. Prompt de "Suscribir" no intrusivo (ej. campana en el footer o botón en el perfil).

* **Story 4.3: PWA & SEO Polish**
    * **As a** Mobile User, **I want** to install the app on my phone, **so that** I can access it from my home screen.
    * *AC:* Manifest.json configurado (Iconos, colores). Service Workers básicos. Sitemap.xml dinámico generado. Meta-tags OpenGraph (Twitter/Facebook cards) funcionando con las imágenes de Cloudinary.