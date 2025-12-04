<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const slug = `archives/${route.params.slug}`
const { data: story } = await useAsyncData(slug, async () => {
	const storyblokApi = useStoryblokApi()
	const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
		version: 'published',
	})
	return data.story
})

const storyBlok = computed(() => {
    if (!story.value) return null
    return { ...story.value.content, name: story.value.name }
})
</script>

<template>
  	<StoryblokComponent v-if="storyBlok" :blok="storyBlok" />
</template>