/// <reference types="node" />
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@storyblok/nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  shadcn: {
    prefix: '',
    componentDir: path.join(__dirname, './app/components/ui'),
  },
  storyblok: {
    accessToken: process.env.STORYBLOK_TOKEN,
    bridge: true,
    devtools: true,
    componentsDir: path.join(__dirname, './app/components/storyblok')
  },
  components: {
    dirs: [
      {
        path: path.join(__dirname, './app/components/storyblok'),
        prefix: ''
      },
      {
        path: path.join(__dirname, './app/components/ui'),
        prefix: ''
      },
      {
        path: path.join(__dirname, './app/components/app'),
        prefix: ''
      }
    ]
  },
  nitro: {
    preset: 'cloudflare-pages',
    output: {
      dir: '.output',
      publicDir: '.output/public'
    }
  },
  runtimeConfig: {
    // Claves privadas (solo disponibles en el servidor/worker)
    kitApiKey: process.env.NUXT_KIT_API_KEY,
    kitFormId: process.env.NUXT_KIT_FORM_ID,
    // Claves públicas (disponibles en el cliente)
    public: {
      // ...
    }
  }
})
