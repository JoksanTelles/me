# Fullstack Architecture: Joksan.dev Platform

**Date:** 27/11/2024
**Version:** 1.0.0
**Status:** Approved
**Author:** Winston (Architect)

## 1\. Introduction

Este documento detalla la arquitectura técnica para **Joksan.dev**, una plataforma web personal construida sobre un stack moderno y gratuito ("The Infinite Free-Tier Stack"). La arquitectura prioriza el rendimiento en el borde (Edge), la mantenibilidad del código y una separación estricta entre presentación (Frontend) y contenido (Headless CMS).

## 2\. High Level Architecture

### 2.1 Architectural Style

**Jamstack Híbrido (Edge-rendered):**
La aplicación no es una SPA pura ni un sitio estático tradicional. Utiliza **Nuxt 3** con renderizado híbrido:

  * **Static (SSG/Prerender):** Para páginas que cambian poco (Inicio, Portafolio, Archivero). Se generan una vez en el build.

### 2.2 System Context Diagram (Mermaid)

```mermaid
graph TD
    User[Visitante / Lector] -->|HTTPS| CF[Cloudflare Edge Network]
    
    subgraph "Cloudflare Ecosystem"
        CF -->|Cache Hit| Static[Static Assets & Prerendered HTML]
        CF -->|Cache Miss| Worker[Nuxt 3 App (Worker)]
    end
    
    subgraph "Content & Data Layer"
        Worker -->|Fetch JSON| SB[Storyblok API]
    end
```

## 3\. Tech Stack

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | **Nuxt 3** | Latest | Core App Framework | SEO nativo, Auto-imports, DX superior. |
| **Language** | **TypeScript** | 5.x | Development | Tipado estático para evitar errores en tiempo de ejecución. |
| **Styling** | **Tailwind CSS** | 3.x | Styling | Utility-first, bajo peso CSS. |
| **UI Library** | **Shadcn-vue** | Latest | Components | Componentes accesibles, personalizables y dueños del código. |
| **CMS** | **Storyblok** | V2 API | Content Management | Editor visual, esquema flexible, API rápida. |
| **Hosting** | **Cloudflare Pages** | - | Deployment | Global CDN, Workers gratuitos, Builds rápidos. |

## 4\. Data Models (Storyblok Schema)

El éxito del proyecto depende de un modelado de contenido correcto en Storyblok.

### 4.1 Content Types (Estructura)

1.  **Page (Landing/General):**

      * Campos: `body` (Blocks), `seo` (Plugin).
      * Uso: Inicio, Acerca de.

2.  **Project (Portafolio):**

      * Campos: `title` (Text), `slug`, `date`, `summary` (Textarea), `cover_image` (Asset), `tech_stack` (Tags/Multiselect), `content` (Rich Text), `github_url`, `live_url`.

3.  **Post (DevLog/Archive):**

      * Campos: `title`, `slug`, `date`, `category` (Single Option), `tags`, `intro`, `content` (Rich Text), `cover_image`.

4.  **Collection (Libro/Novela):**

      * Campos: `title`, `slug`, `status` (Draft/Published/Completed), `synopsis` (Rich Text), `cover_art` (Image), `genre`.
      * *Nota:* Actúa como "Folder" en Storyblok.

5.  **Chapter (Capítulo):**

      * Ubicación: Dentro de una carpeta `Collection`.
      * Campos: `title`, `chapter_number` (Number), `content` (Rich Text - Simplificado para lectura), `author_notes` (Rich Text).

6.  **Global Config:**

      * Campos: `header_nav` (Links), `footer_links`, `social_media`, `site_settings`.

## 5\. Unified Project Structure

Estructura de directorios estándar de Nuxt 3 optimizada para mantenibilidad.

```text
joksan-dev/
├── .output/                # Build artifacts (Cloudflare)
├── assets/                 # CSS global (Tailwind directivas)
├── components/
│   ├── ui/                 # Shadcn components (Button, Card, etc.)
│   ├── storyblok/          # Bloks conectados al CMS (Hero, Grid, etc.)
│   ├── content/            # Componentes específicos de contenido (CodeBlock)
│   └── app/                # Componentes globales (Navbar, Footer)
├── composables/            # Lógica reutilizable (useReadingProgress, useSeo)
├── layouts/
│   ├── default.vue         # Layout estándar
│   └── reader.vue          # Layout de lectura (sin distracciones)
├── pages/
│   ├── index.vue           # Landing
│   ├── portfolio/          # Listado y [slug].vue
│   ├── devlog/             # Listado y [slug].vue
│   └── s/                  # Stories
│       ├── index.vue       # Librería
│       └── [story]/        # Colección
│           └── [chapter].vue # Visor de capítulo
├── public/                 # Favicon, robots.txt, manifest
├── server/
│   └── api/
│       └── subscribe.post.ts # Proxy para Kit (Newsletter)
├── utils/                  # Helpers (formatDate, readingTime)
├── app.vue                 # Entry point
├── nuxt.config.ts          # Configuración principal
└── tailwind.config.ts      # Configuración de diseño
```

## 6\. Core Workflows & Logic

### 6.1 Rendering Strategy (nuxt.config.ts)

Para maximizar el plan gratuito y el rendimiento:

```typescript
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },           // Estático puro
    '/portfolio/**': { prerender: true }, // Estático puro
  }
})
```

## 7\. Integrations

### 7.1 Newsletter (Kit)

  * **Frontend:** Formulario Shadcn con validación Zod.
  * **Backend (Server Route):** Recibe el email → Valida → Envía POST a la API de Kit usando `KIT_API_KEY` (variable de entorno en Cloudflare).
  * **Seguridad:** La API Key nunca se expone al cliente.

## 8\. Development & Deployment

### 8.1 Local Setup

```bash
npx nuxi init joksan-dev
npm install
npx shadcn-vue@latest init
# Configurar .env con STORYBLOK_TOKEN
npm run dev
```

### 8.2 Deployment Pipeline (Cloudflare Pages)

1.  **Push to Main (GitHub):** Dispara el build en Cloudflare.
2.  **Build Command:** `npm run build` (Genera salida compatible con Workers).
3.  **Output Directory:** `.output/public` (Nuxt Nitro preset).
4.  **Environment Variables:** Configurar en el dashboard de Cloudflare (`STORYBLOK_TOKEN`).