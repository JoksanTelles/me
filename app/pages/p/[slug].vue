<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const slug = `projects/${route.params.slug}`
const { data: story, pending, error } = await useAsyncData(slug, async () => {
	const storyblokApi = useStoryblokApi()
	const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
		version: 'published',
	})
	return data?.story
})

const storyBlok = computed(() => {
    if (!story.value) return null
    return { ...story.value.content, name: story.value.name }
})
</script>

<template>
	<div v-if="storyBlok" class="p-4">
		<StoryblokComponent :blok="storyBlok" />
	</div>

	<div v-else class="p-4 text-gray-500">
		<p v-if="pending">Loading project...</p>
		<p v-else-if="error" class="text-red-500">Error loading project: {{ error }}</p>
		<p v-else class="text-yellow-500">No project found for slug: {{ route.params.slug }}</p>
	</div>
</template>