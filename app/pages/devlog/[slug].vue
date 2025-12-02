<script setup lang="ts">
const route = useRoute()

const { story, pending, error } = await useAsyncStoryblok(`logs/${route.params.slug}`, {
  api: { version: 'published'},
  bridge: {}
})
</script>

<template>
  <div>
    <StoryblokComponent v-if="story?.content" :blok="{ ...story.content, name: story.name }" />
    <div v-else class="p-4 text-gray-500">
      <p v-if="pending">Loading story...</p>
      <p v-else-if="error" class="text-red-500">Error loading story: {{ error }}</p>
      <p v-else class="text-yellow-500">No story found for slug: {{ route.params.slug }}</p>
    </div>
  </div>
</template>
