<script setup lang="ts">
const route = useRoute()
const slug = `stories/${route.params.slug}`

// Cargar la entrada 'index' dentro de la carpeta del slug
// Ruta esperada: stories/mi-novela/index (o solo stories/mi-novela si es carpeta raíz)
// Storyblok resuelve automáticamente las carpetas al index si existe.
const { data: story } = await useAsyncData(slug, async () => {
  const storyblokApi = useStoryblokApi()
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: 'published',
  })
  return data.story
})
</script>

<template>
    <StoryblokComponent v-if="story" :blok="story.content" />
</template>