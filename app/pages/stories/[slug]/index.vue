<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

// Cargar la entrada 'index' dentro de la carpeta del slug
// Ruta esperada: stories/mi-novela/index (o solo stories/mi-novela si es carpeta raíz)
// Storyblok resuelve automáticamente las carpetas al index si existe.
const { story } = await useAsyncStoryblok(`stories/${slug}`, {
  api: { version: 'published'},
  bridge: {}
})
</script>

<template>
    <StoryblokComponent v-if="story" :blok="story.content" />
</template>