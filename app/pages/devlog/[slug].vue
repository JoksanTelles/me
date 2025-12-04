<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const slug = `logs/${route.params.slug}`

const { data: story } = await useAsyncData(slug, async () => {
  const storyblokApi = useStoryblokApi()
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: 'draft',
  })
  return data.story
})

// Create a computed property to merge story name as title fallback
const pageBlok = computed(() => {
  if (!story.value) {
    return null
  }
  return {
    ...story.value.content,
    title: story.value.content.title || story.value.name,
  }
})
</script>

<template>
  <StoryblokComponent v-if="pageBlok" :blok="pageBlok" />
</template>
