import { defineNuxtPlugin } from '#app'

// Import Storyblok components
import Page from '../components/storyblok/Page.vue'
import Feature from '../components/storyblok/Feature.vue'
import Grid from '../components/storyblok/Grid.vue'
import Teaser from '../components/storyblok/Teaser.vue'
import Project from '../components/storyblok/Project.vue'
import Log from '../components/storyblok/Log.vue'
import Archive from '../components/storyblok/Archive.vue'
import Post from '../components/storyblok/Post.vue'
import Story from '../components/storyblok/Story.vue'
import Chapter from '../components/storyblok/Chapter.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Register Storyblok components globally with lowercase names
  // These must match the blok type names in Storyblok
  nuxtApp.vueApp.component('page', Page)
  nuxtApp.vueApp.component('feature', Feature)
  nuxtApp.vueApp.component('grid', Grid)
  nuxtApp.vueApp.component('teaser', Teaser)
  nuxtApp.vueApp.component('project', Project)
  nuxtApp.vueApp.component('projects', Project) // Also register as plural
  nuxtApp.vueApp.component('log', Log)
  nuxtApp.vueApp.component('logs', Log) // Also register as plural
  nuxtApp.vueApp.component('devlog', Log)
  nuxtApp.vueApp.component('devlogs', Log) // Register as devlogs too
  nuxtApp.vueApp.component('archive', Archive)
  nuxtApp.vueApp.component('archives', Archive) // Also register as plural
  nuxtApp.vueApp.component('post', Post)
  nuxtApp.vueApp.component('posts', Post) // Also register as plural
  nuxtApp.vueApp.component('story', Story)
  nuxtApp.vueApp.component('stories', Story) // Also register as plural
  nuxtApp.vueApp.component('chapter', Chapter)
})
