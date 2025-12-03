<script setup lang="ts">
const route = useRoute()

const slug = `archives/${route.params.slug}`
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