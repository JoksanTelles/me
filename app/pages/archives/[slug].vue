<script setup lang="ts">
const route = useRoute()
// Storyblok full_slug será 'archives/slug-del-articulo'
const { story } = await useAsyncStoryblok(`archives/${route.params.slug}`, {
  api: { version: 'published'},
  bridge: {}
})
</script>

<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>