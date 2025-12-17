<script setup lang="ts">
import { ref, computed } from 'vue'
const route = useRoute()

const slug = `chapters/${route.params.chapter}`

const { data: story } = await useAsyncData(slug, async () => {
  const storyblokApi = useStoryblokApi()
  try {
    // Removed resolve_relations as we no longer need the parent story's title
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft',
    })
    return data.story
  }
  catch (error) {
    console.error(error)
    return null
  }
})

// Set the head title to "{{chapter.title}} | joksan.dev"
useHead(() => ({
  title: story.value ? `${story.value.name} | joksan.dev` : 'joksan.dev',
}))

const blok = computed(() => {
  if (!story.value?.content) {
    return null
  }
  const modifiedContent = {
    ...story.value.content,
    title: story.value.name,
  }
  if (modifiedContent.component === 'chapters') {
    modifiedContent.component = 'chapter'
  }
  return modifiedContent
})

console.log('Fetched story:', story)
</script>

<template>
	<div class="container mx-auto max-w-prose py-8">
		<!-- Real Chapter from Storyblok -->
		<StoryblokComponent v-if="blok" :blok="blok" />

		<div
			v-else
			class="rounded-lg border bg-card text-card-foreground shadow-sm"
		>
			<div class="flex flex-col space-y-1.5 p-6">
				<h3 class="text-2xl font-semibold leading-none tracking-tight">
					Oops! No se encontró el capítulo
				</h3>
				<p class="text-sm text-muted-foreground">
					Al parecer no hay un capítulo publicado en esta dirección:
					<code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
						{{ slug }}
					</code>
				</p>
			</div>
		</div>
	</div>
</template>
