<script setup lang="ts">
const storyblokApi = useStoryblokApi()
const route = useRoute()

const version = computed(() => route.query._storyblok ? 'draft' : 'published')

// Fetch solo de 'Stories' (Libros)
const { data } = await storyblokApi.get('cdn/stories', {
  version: version.value,
  content_type: 'stories', // Filtrar solo las portadas
})

const stories = data.stories
</script>

<template>
    <div class="container py-12">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h1 class="text-4xl font-bold tracking-tight font-serif">Biblioteca</h1>
            <p class="text-muted-foreground text-lg">
                Colección de historias originales, novelas y experimentos narrativos.
            </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            <NuxtLink 
                v-for="story in stories" 
                :key="story.uuid"
                :to="`/${story.full_slug}`"
                class="group space-y-3"
            >
                <div class="aspect-[2/3] overflow-hidden rounded-md border bg-muted shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 relative">
                <img 
                    v-if="story.content.cover?.filename"
                    :src="story.content.cover.filename + '/m/400x600'" 
                    :alt="story.content.title"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div v-else class="h-full w-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <span class="text-4xl">📚</span>
                </div>
                
                <div v-if="story.content.status" class="absolute top-2 right-2">
                    <Badge variant="secondary" class="shadow-sm backdrop-blur-md bg-background/80">
                    {{ story.content.status }}
                    </Badge>
                </div>
                </div>

                <div class="space-y-1">
                <h3 class="font-bold leading-tight group-hover:text-primary transition-colors">
                    {{ story.content.title }}
                </h3>
                <div class="flex flex-wrap gap-1">
                    <span v-for="g in story.content.genres?.slice(0, 2)" :key="g" class="text-xs text-muted-foreground">
                    {{ g }}
                    </span>
                </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>