<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug
const chapter = route.params.chapter

// Cargar la historia. 
// Ruta esperada en Storyblok: stories/{libro}/{capitulo}
const { story } = await useAsyncStoryblok(`stories/${slug}/${chapter}`, {
  api: { version: 'published'},
  bridge: {}
})

// Definimos un layout especial para lectura si quisiéramos quitar el footer global,
// pero por ahora usaremos el default y el componente Chapter se encarga de la estética.
</script>

<template>
    <StoryblokComponent v-if="story" :blok="story.content" />
</template>