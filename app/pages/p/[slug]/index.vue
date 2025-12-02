<script setup lang="ts">
const route = useRoute()

// Debug
console.log('Project slug:', route.params.slug)

// Load the story based on the URL slug
// useAsyncStoryblok returns a reactive object with story, pending, and error properties
const { story, pending, error } = await useAsyncStoryblok(`projects/${route.params.slug}`, {
  api: { version: 'published'},
  bridge: {}
})

console.log('Project story loaded:', story?.value)
console.log('Project error:', error?.value)
</script>

<template>
  <div v-if="story?.content" class="p-4">
    <StoryblokComponent :blok="story.content" />
  </div>
  <div v-else class="p-4 text-gray-500">
    <p v-if="pending">Loading project...</p>
    <p v-else-if="error" class="text-red-500">Error loading project: {{ error }}</p>
    <p v-else class="text-yellow-500">No project found for slug: {{ route.params.slug }}</p>
  </div>
</template>