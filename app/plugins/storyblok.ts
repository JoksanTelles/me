import { defineNuxtPlugin } from '#app'

// Import Storyblok components
import Page from '../components/storyblok/Page.vue'
import Feature from '../components/storyblok/Feature.vue'
import Grid from '../components/storyblok/Grid.vue'
import Teaser from '../components/storyblok/Teaser.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Register Storyblok components globally with lowercase names
  // These must match the blok type names in Storyblok
  nuxtApp.vueApp.component('page', Page)
  nuxtApp.vueApp.component('feature', Feature)
  nuxtApp.vueApp.component('grid', Grid)
  nuxtApp.vueApp.component('teaser', Teaser)
})
