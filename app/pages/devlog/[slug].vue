<script setup lang="ts">
const route = useRoute()

const slug = `logs/${route.params.slug}`
const { data: story, pending, error } = await useAsyncData(slug, async () => {
  const storyblokApi = useStoryblokApi()
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: 'published',
  })
  return data.story
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
